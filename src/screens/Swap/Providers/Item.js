// @flow

import React, { useCallback, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getKYCStatus } from "@ledgerhq/live-common/lib/exchange/swap";
import { swapKYCSelector } from "../../../reducers/settings";
import { setSwapKYCStatus } from "../../../actions/settings";
import IconInfo from "../../../icons/Info";
import IconCheckCircle from "../../../icons/CheckCircle";
import { rgba } from "../../../colors";
import LText from "../../../components/LText";
import BulletList, { BulletSmallDot } from "../../../components/BulletList";

const ProviderListItem = ({
  id,
  selected,
  onSelect,
  icon,
  title,
  bullets,
  kyc,
}: {
  id: string,
  selected?: string,
  onSelect: string => void,
  icon?: any,
  title: React$Node,
  bullets: string[],
  kyc?: boolean,
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
    console.log({ bullets });
    if (providerKYC && providerKYC.status !== "approved") {
      onUpdateKYCStatus();
    }
  }, [bullets, onUpdateKYCStatus, providerKYC]);

  const status = providerKYC?.status || "required";
  const KYCColor =
    {
      closed: colors.alert,
      pending: colors.orange,
      required: colors.smoke,
      approved: colors.green,
    }[status] || colors.red;

  return (
    <TouchableOpacity onPress={() => onSelect(id)}>
      <View
        style={[
          styles.wrapper,
          { borderColor: selected === id ? colors.live : colors.fog },
        ]}
      >
        <View style={styles.head}>
          {icon}
          <LText style={styles.title} semiBold>
            {title}
          </LText>

          {kyc ? (
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
              {status === "approved" ? (
                <IconCheckCircle color={KYCColor} size={14} />
              ) : (
                <IconInfo color={KYCColor} size={14} />
              )}
            </View>
          ) : null}
        </View>
        {bullets && !!bullets.length && (
          <View style={styles.bullets}>
            <BulletList
              itemContainerStyle={styles.bullet}
              itemStyle={styles.bulletItem}
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
        )}
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
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
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
  bulletItem: {
    paddingLeft: 6,
  },
  headRight: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  status: {
    fontSize: 10,
    marginRight: 8,
  },
});

export default ProviderListItem;
