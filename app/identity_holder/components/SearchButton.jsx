import { renderIconByName } from "../scripts/util";

// TODO: Implement onPress param
const SearchButton = (onPress) => {
  return renderIconByName("magnify", { size: 30 });
}

export default SearchButton;
