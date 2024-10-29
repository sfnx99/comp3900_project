var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('./auth');
const { Credential, Notification } = require('../models'); 

router.use(express.json());

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/add', authenticateToken, async function(req, res, next) {
  const { fields, validityPeriod } = req.body;
  const credentialWithId = new Credential({ fields, validityPeriod });

  try {
    await credentialWithId.save();

    const nameField = fields.find(field => field.name === 'Name of Credential');
    const notification = new Notification({
      message: `The credential "${nameField.value}" has been approved by the NSW Government. Now you can manage this credential in View Credentials.`,
    });
    await notification.save();

    console.log("Received credentials:", credentialWithId);
    console.log("Added notification:", notification);
    res.status(200).json(credentialWithId);
  } catch (error) {
    console.error('Error saving credential:', error);
    res.status(500).json({ message: 'Error saving credential' });
  }
});

router.get('/list', authenticateToken, async function(req, res, next) {
  try {
    const credentialsList = await Credential.find({});
    const formattedList = credentialsList.map(credential => {
      const credentialName = credential.fields.find(field => field.name === 'Name of Credential')?.value;
      return {
        id: credential._id,
        credentialName: credentialName,
        validityPeriod: credential.validityPeriod,
      };
    });
    console.log("Returning credentials:", formattedList);
    res.status(200).json(formattedList);
  } catch (error) {
    console.error('Error fetching credentials:', error);
    res.status(500).json({ message: 'Error fetching credentials' });
  }
});

router.get('/:id', authenticateToken, async function(req, res, next) {
  try {
    const credential = await Credential.findById(req.params.id);
    if (credential) {
      res.status(200).json(credential);
    } else {
      res.status(404).send('Credential not found');
    }
  } catch (error) {
    console.error('Error fetching credential:', error);
    res.status(500).json({ message: 'Error fetching credential' });
  }
});

router.delete('/:id', authenticateToken, async function(req, res, next) {
  try {
    const credential = await Credential.findByIdAndDelete(req.params.id);
    if (credential) {
      const nameField = credential.fields.find(field => field.name === 'Name of Credential');
      const notification = new Notification({
        message: `The request for deletion of the credential "${nameField.value}" was successful.`,
      });
      await notification.save();

      console.log("Deleted credential:", credential);
      console.log("Added notification:", notification);
      res.status(200).json({ message: 'Credential deleted successfully' });
    } else {
      res.status(404).send('Credential not found');
    }
  } catch (error) {
    console.error('Error deleting credential:', error);
    res.status(500).json({ message: 'Error deleting credential' });
  }
});

router.get('/notifications', authenticateToken, async function(req, res, next) {
  try {
    const notifications = await Notification.find({});
    console.log("Returning notifications:", notifications);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

module.exports = router;