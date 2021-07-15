// import original module declarations
import 'styled-components';
import 'styled-components/native';
import {Theme} from './theme';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
