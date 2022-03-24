import React, { Component } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Box } from "@ledgerhq/native-ui";
import { track } from "../analytics";
import SettingsRow from "../components/SettingsRow";
import FilteredSearchBar from "../components/FilteredSearchBar";

type EntryProps<Item> = {
  item: Item;
  onPress: (value: Item) => void;
  selected: boolean;
};
type EntryComponent<Item> = React.Component<EntryProps<Item>>;

type Opts<Item> = {
  id: string;
  itemEventProperties: (value: Item) => Object;
  keyExtractor: (value: Item) => string;
  formatItem?: (value: Item) => React.ReactElement;
  Entry?: EntryComponent<Item>;
  navigationOptions?: Object;
  ListHeaderComponent?: any;
  searchable?: boolean;
  searchKeys?: string[];
  searchInputWrapperStyle?: any;
};

function getEntryFromOptions<Item>(opts: Opts<Item>): EntryComponent<Item> {
  if (opts.Entry) return opts.Entry;
  const { formatItem } = opts;
  if (!formatItem) {
    throw new Error("formatItem is required if Entry is not provided");
  }
  return class DefaultEntry extends Component<EntryProps<Item>> {
    onPress = () => this.props.onPress(this.props.item);

    render() {
      const { item, selected } = this.props;
      return (
        <SettingsRow
          title={formatItem(item)}
          onPress={this.onPress}
          selected={!!selected}
          compact
        />
      );
    }
  };
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 16,
    paddingBottom: 64,
  },
  padding: {
    paddingHorizontal: 16,
  },
});

export default function makeGenericSelectScreen<Item>(opts: Opts<Item>) {
  const {
    id,
    itemEventProperties,
    keyExtractor,
    searchable,
    searchKeys,
    searchInputWrapperStyle,
  } = opts;
  const Entry: EntryComponent<Item> = getEntryFromOptions(opts);

  return class GenericSelectScreen extends Component<{
    selectedKey?: string;
    items: Item[];
    onValueChange: (items: Item, props: any) => void;
    navigation: any;
    cancelNavigateBack?: boolean;
    initialSearchQuery?: string;
  }> {
    onPress = (item: Item) => {
      const { navigation, onValueChange, cancelNavigateBack } = this.props;
      onValueChange(item, this.props);
      if (!cancelNavigateBack) {
        navigation.goBack();
      }
      track(id, itemEventProperties(item));
    };

    renderItem = ({ item }: { item: Item }) => (
      <Entry
        onPress={this.onPress}
        item={item}
        selected={keyExtractor(item) === this.props.selectedKey}
      />
    );

    renderList = (items: Item[]) => (
      <FlatList
        ListHeaderComponent={opts.ListHeaderComponent}
        data={items}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.root}
      />
    );

    render() {
      return (
        <Box backgroundColor={"background.main"} px={6}>
          {searchable ? (
            <FilteredSearchBar
              list={this.props.items}
              renderList={this.renderList}
              keys={searchKeys}
              initialQuery={this.props.initialSearchQuery}
              inputWrapperStyle={searchInputWrapperStyle || styles.padding}
              renderEmptySearch={() => null}
            />
          ) : (
            this.renderList(this.props.items)
          )}
        </Box>
      );
    }
  };
}
