// @flow

import { reset } from "@ledgerhq/live-common/lib/libcore/access";
import { delay } from "@ledgerhq/live-common/lib/promise";

export default (job?: () => Promise<any>) =>
  // Fix: Not using afterLibcoreGC anymore cause it's n
  // afterLibcoreGC(
  async () => {
    await delay(1000);
    if (job) {
      await job();
    }
    await reset();
    await delay(2000);
  };
// );
