//@flow
import { withStaticURL } from "@ledgerhq/hw-transport-http";
import Config from "react-native-config";
export default withStaticURL(Config.DEBUG_COMM_HTTP_PROXY);
