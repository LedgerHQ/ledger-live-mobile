import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Switch } from "@ledgerhq/native-ui";
import SettingsRow from "../../../components/SettingsRow";
import { carouselVisibilitySelector } from "../../../reducers/settings";
import { setCarouselVisibility } from "../../../actions/settings";
import { CAROUSEL_NONCE } from "../../../components/Carousel";

const CarouselRow = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const carouselVisibility = useSelector(carouselVisibilitySelector);
  const onSetCarouselVisibility = useCallback(
    checked => dispatch(setCarouselVisibility(checked ? 0 : CAROUSEL_NONCE)),
    [dispatch],
  );

  return (
    <SettingsRow
      event="CarouselToggleRow"
      title={t("settings.display.carousel")}
      desc={t("settings.display.carouselDesc")}
    >
      <Switch
        checked={carouselVisibility !== CAROUSEL_NONCE}
        onChange={onSetCarouselVisibility}
      />
    </SettingsRow>
  );
};

export default CarouselRow;
