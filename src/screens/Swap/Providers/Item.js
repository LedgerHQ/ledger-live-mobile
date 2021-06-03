// @flow

import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { getKYCStatus } from "@ledgerhq/live-common/lib/exchange/swap";
import { rgba } from "../../../colors";

import { swapKYCSelector } from "../../../reducers/settings";
import { setSwapKYCStatus } from "../../../actions/settings";
import IconInfo from "../../../icons/Info";
import IconCloseCircle from "../../../icons/CloseCircle";
import LText from "../../../components/LText";
import BulletList, { BulletSmallDot } from "../../../components/BulletList";

const Item = ({
  id,
  selected,
  onSelect,
  Icon,
  title,
  bullets,
  kyc,
  notAvailable,
}: {
  id: string,
  selected?: string,
  onSelect: string => void,
  Icon: any,
  title: React$Node,
  bullets: Array<React$Node>,
  kyc?: boolean,
  notAvailable?: boolean,
}) => {
  const { colors } = useTheme();
  const swapKYC = useSelector(swapKYCSelector);
  const dispatch = useDispatch();
  const providerKYC = swapKYC[id];

  const onUpdateKYCStatus = useCallback(() => {
    let cancelled = false;
    async function updateKYCStatus() {
      if (!providerKYC?.id) return;
      const res = await getKYCStatus(id, providerKYC.id);
      if (cancelled || res?.status === providerKYC?.status) return;
      dispatch(
        setSwapKYCStatus({ provider: id, id: res?.id, status: res?.status }),
      );
    }
    updateKYCStatus();
    return () => {
      cancelled = true;
    };
  }, [dispatch, id, providerKYC]);

  useEffect(() => {
    if (providerKYC && providerKYC.status !== "approved") {
      onUpdateKYCStatus();
    }
  }, [onUpdateKYCStatus, providerKYC]);

  const status = providerKYC?.status || "required";
  const KYCColor =
    {
      closed: colors.alert,
      pending: colors.orange,
      required: colors.smoke,
      approved: colors.green,
    }[status] || colors.red;

  return (
    <TouchableOpacity onPress={() => onSelect(id)} disabled={notAvailable}>
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: notAvailable
              ? rgba(colors.fog, 0.2)
              : colors.white,
          },
          { borderColor: selected === id ? colors.live : colors.fog },
        ]}
      >
        <View style={styles.head}>
          <View style={styles.headLeft}>
            <Icon size={32} />
            <LText style={styles.title} semiBold>
              {title}
            </LText>
          </View>
          {notAvailable ? (
            <View
              style={[
                styles.headRight,
                { backgroundColor: rgba(colors.alert, 0.1) },
              ]}
            >
              <LText style={[styles.status, { color: colors.alert }]} semiBold>
                <Trans i18nKey={`transfer.swap.providers.kyc.notAvailable`} />
              </LText>
              <IconCloseCircle color={colors.alert} size={16} />
            </View>
          ) : kyc ? (
            <View
              style={[
                styles.headRight,
                { backgroundColor: rgba(KYCColor, 0.1) },
              ]}
            >
              <LText style={[styles.status, { color: KYCColor }]} semiBold>
                <Trans
                  i18nKey={`transfer.swap.providers.kyc.status.${status}`}
                />
              </LText>
              <IconInfo color={KYCColor} size={16} />
            </View>
          ) : null}
        </View>
        <View style={styles.bullets}>
          <BulletList
            itemContainerStyle={styles.bullet}
            itemStyle={{
              paddingLeft: 6,
            }}
            Bullet={BulletSmallDot}
            list={bullets.map(wording => (
              <LText
                style={[styles.bulletText, { color: colors.smoke }]}
                semiBold
              >
                {wording}
              </LText>
            ))}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headRight: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    marginLeft: 12,
  },
  status: {
    fontSize: 10,
    marginRight: 8,
  },
  bullets: {
    marginTop: 16,
  },
  bullet: {
    paddingVertical: 0,
    paddingBottom: 5,
  },
  bulletText: {
    fontSize: 13,
  },
});

export default Item;
