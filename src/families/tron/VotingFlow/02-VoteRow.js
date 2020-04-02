/* @flow */
import React, { useCallback, useMemo, memo, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Trans } from "react-i18next";

import type {
  Vote,
  SuperRepresentative,
} from "@ledgerhq/live-common/lib/families/tron/types";

import Swipeable from "react-native-gesture-handler/Swipeable";
import * as Animatable from "react-native-animatable";

import getWindowDimensions from "../../../logic/getWindowDimensions";

import colors from "../../../colors";
import LText from "../../../components/LText";

import Trash from "../../../icons/Trash";
import Trophy from "../../../icons/Trophy";
import Medal from "../../../icons/Medal";
import Edit from "../../../icons/Edit";

const { width } = getWindowDimensions();

const RightAction = ({
  dragX,
  onRemove,
}: {
  dragX: *,
  onRemove: () => void,
}) => {
  const scale = dragX.interpolate({
    inputRange: [-57, -56, -16, 0],
    outputRange: [1, 1, 0.5, 0],
  });

  return (
    <Animated.View
      style={[
        styles.rightDrawer,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Trash size={16} color={colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

type VoteRowProps = {
  vote: Vote,
  superRepresentatives: SuperRepresentative[],
  onEdit: (vote: Vote, name: string) => void,
  onRemove: (vote: Vote) => void,
};

const VoteRow = ({
  vote,
  superRepresentatives = [],
  onEdit,
  onRemove,
}: VoteRowProps) => {
  const rowRef = useRef();
  const { address, voteCount } = vote;

  const srIndex = useMemo(
    () => superRepresentatives.findIndex(sr => sr.address === address),
    [superRepresentatives, address],
  );

  const removeVote = useCallback(() => onRemove(vote), [vote, onRemove]);

  const removeVoteAnimStart = useCallback(() => {
    if (rowRef && rowRef.current && rowRef.current.transitionTo)
      rowRef.current.transitionTo(
        { opacity: 0, height: 0, marginVertical: 0 },
        400,
      );
    else removeVote();
  }, [rowRef, removeVote]);

  const { name, rank, isSR, voteCount: nbOfVotes, brokerage } = useMemo(
    () => ({
      ...superRepresentatives[srIndex],
      rank: srIndex + 1,
      isSR: srIndex < 27,
    }),
    [superRepresentatives, srIndex],
  );

  return (
    <Animatable.View
      style={styles.root}
      ref={rowRef}
      onTransitionEnd={removeVote}
    >
      <Swipeable
        friction={2}
        rightThreshold={27}
        overshootRight={false}
        renderRightActions={(progress, dragX) => (
          <RightAction dragX={dragX} onRemove={removeVoteAnimStart} />
        )}
      >
        <View style={styles.srRow}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              {isSR ? (
                <Trophy size={16} color={colors.live} />
              ) : (
                <Medal size={16} color={colors.live} />
              )}
            </View>
            <View style={styles.rowLabelContainer}>
              <LText semiBold style={styles.rowTitle} numberOfLines={1}>
                {name || address}
              </LText>
              <LText style={styles.rowLabel}>
                <Trans i18nKey="vote.castVotes.ranking" values={{ rank }}>
                  <LText semiBold style={styles.rowTitle}>
                    text
                  </LText>
                </Trans>
              </LText>
            </View>
            <TouchableOpacity
              onPress={() => onEdit(vote, name || address)}
              style={styles.editButton}
            >
              <Edit size={14} color={colors.darkBlue} />
              <LText semiBold style={styles.editVoteCount}>
                {voteCount}
              </LText>
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <View style={styles.rowLabelContainer}>
              <LText style={styles.rowLabel}>
                <Trans i18nKey="vote.castVotes.nbOfVotes" />
              </LText>
              <LText semiBold style={styles.rowTitle} numberOfLines={1}>
                {nbOfVotes}
              </LText>
            </View>
            <View style={styles.rowLabelContainer}>
              <LText style={styles.rowLabel}>
                <Trans i18nKey="vote.castVotes.percentage" />
              </LText>
              <LText semiBold style={styles.rowTitle} numberOfLines={1}>
                {brokerage} %
              </LText>
            </View>
            {/** @TODO add in estimated yield here */}
          </View>
        </View>
      </Swipeable>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 125,
    width: "100%",
    marginVertical: 5,
    overflow: "visible",
  },
  srRow: {
    height: 125,
    width: width - 32,
    left: 16,
    borderRadius: 4,
    flexDirection: "column",
    backgroundColor: colors.white,
    zIndex: 10,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rowIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 5,
    backgroundColor: colors.lightLive,
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.darkBlue,
    paddingBottom: 4,
  },
  rowLabelContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    flex: 1,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  editVoteCount: {
    fontSize: 17,
    color: colors.live,
    marginLeft: 6,
  },
  rowLabel: {
    fontSize: 13,
    color: colors.grey,
  },
  separator: {
    width: "100%",
    flexBasis: 1,
    backgroundColor: colors.lightFog,
  },
  rightDrawer: {
    width: 56,
    paddingRight: 16,
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: colors.alert,
  },
});

export default memo<VoteRowProps>(VoteRow);
