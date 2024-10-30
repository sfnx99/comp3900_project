import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <LinksContainer>
        <FooterLink href="#">Privacy Policy</FooterLink> | 
        <FooterLink href="#">  Copyright & Disclaimer</FooterLink> | 
        <FooterLink href="#">  Accessibility</FooterLink> | 
        <FooterLink href="#">  Sitemap</FooterLink> | 
        <FooterLink href="#">  Site Feedback</FooterLink>
      </LinksContainer>
      <AdditionalInfo>
        UNSW Sydney NSW 2052 Australia Telephone +61 2 9385 1000<br />
        Authorised by Deputy Vice-Chancellor Academic<br />
        UNSW CRICOS Provider Code: 00098G ABN: 57 195 873 179
      </AdditionalInfo>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: black;
  text-align: left; /* Align text to the left */
  padding: 20px 100px; /* Add padding for better alignment */
  position: fixed;
  bottom: 0;
  width: 100%;
  color: white;
  font-size: 0.8em;
  line-height: 1.4;

`;

const LinksContainer = styled.div`
  margin-bottom: 10px;
  color: #ffca0e;
`;

const FooterLink = styled.a`
  color: #ffca0e;
  text-decoration: none;
  margin: 20 20px;

  &:hover {
    text-decoration: underline;
  }
`;

const AdditionalInfo = styled.p`
  margin: 0;
`;

export default Footer;