import React from "react";
import { OperationType } from "@ledgerhq/live-common/lib/types";
import { Icons, BoxedIcon } from "@ledgerhq/native-ui";
import {
  DEFAULT_BOX_SIZE,
  DEFAULT_ICON_SIZE,
  DEFAULT_BADGE_SIZE,
} from "@ledgerhq/native-ui/components/Icon/BoxedIcon";

const iconsComponent = {
  OUT: Icons.ArrowTopMedium,
  IN: Icons.ArrowBottomMedium,
  DELEGATE: Icons.HandshakeMedium,
  REDELEGATE: Icons.DelegateMedium,
  UNDELEGATE: Icons.UndelegateMedium,
  REVEAL: Icons.EyeMedium,
  CREATE: Icons.PlusMedium,
  NONE: Icons.ArrowFromBottomMedium,
  FREEZE: Icons.FreezeMedium,
  UNFREEZE: Icons.UnfreezeMedium,
  VOTE: Icons.VoteMedium,
  REWARD: Icons.StarMedium,
  FEES: Icons.FeesMedium,
  OPT_IN: Icons.PlusMedium,
  OPT_OUT: Icons.TrashMedium,
  CLOSE_ACCOUNT: Icons.TrashMedium,
  REDEEM: Icons.MinusMedium,
  SUPPLY: Icons.ArrowRightMedium,
  APPROVE: Icons.PlusMedium,
  BOND: Icons.LinkMedium,
  UNBOND: Icons.LinkNoneMedium,
  WITHDRAW_UNBONDED: Icons.CoinsMedium,
  SLASH: Icons.TrashMedium,
  NOMINATE: Icons.VoteMedium,
  CHILL: Icons.VoteMedium,
  REWARD_PAYOUT: Icons.ClaimRewardsMedium,
  SET_CONTROLLER: Icons.ArrowFromBottomMedium,
  NFT_IN: undefined, // TODO: get an icon from design team
  NFT_OUT: undefined, // TODO: get an icon from design team
};

export default ({
  type,
  confirmed,
  failed,
  size = 24,
}: {
  size?: number;
  type: OperationType;
  confirmed?: boolean;
  failed?: boolean;
}) => {
  const Icon = iconsComponent[type] || iconsComponent.NONE;
  const BadgeIcon = failed
    ? Icons.CircledCrossSolidMedium
    : confirmed
    ? undefined
    : Icons.CircledCrossSolidMedium;
  const borderColor = failed ? "error.c40" : "neutral.c40";
  const iconColor = failed
    ? "error.c100"
    : confirmed
    ? "neutral.c100"
    : "neutral.c50";
  const badgeColor = failed ? "error.c100" : "neutral.c70";
  return (
    <BoxedIcon
      Icon={Icon}
      Badge={BadgeIcon}
      size={size}
      iconSize={(size * DEFAULT_ICON_SIZE) / DEFAULT_BOX_SIZE}
      badgeSize={(size * DEFAULT_BADGE_SIZE) / DEFAULT_BOX_SIZE}
      borderColor={borderColor}
      iconColor={iconColor}
      badgeColor={badgeColor}
    />
  );
};
