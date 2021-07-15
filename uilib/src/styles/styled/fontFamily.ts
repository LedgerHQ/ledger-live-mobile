import {ff} from '../helpers';

export default (props: any) => {
  const prop = props.ff;

  if (!prop) {
    return null;
  }

  return ff(prop);
};
