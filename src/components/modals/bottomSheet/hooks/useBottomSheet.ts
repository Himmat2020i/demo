import debounce from "lodash/debounce";
import { useEffect, useRef, useState } from "react";
import { closeModal } from "../../../../helpers/utils";
import { useBottomSheetStyle } from "../BottomSheetStyle";
import { MODALS } from "../../../../constants/routeConstant";
import { ModalfyParams, UsableModalComponentProp } from "react-native-modalfy";
import {
  SearchData,
  SearchParams,
} from "../../../../interfaces/searchAddressData";
import { useLazySearchAddressQuery } from "../../../../services/addressSearch";
import { SEARCH_ACCESS_CODE } from "../../../../constants/constants";
import { TextInput } from "react-native";

interface Props {
  // eslint-disable-next-line prettier/prettier
  modal: UsableModalComponentProp<ModalfyParams, keyof ModalfyParams>;
}

const useBottomSheet = ({ modal }: Props) => {
  const dataType = modal.getParam("dataType");
  const item = modal.getParam("item", []);
  const type = modal.getParam("type", "");
  const value = modal.getParam("value", "");
  const nameKey = modal.getParam("nameKey", "");
  const { styles, colors } = useBottomSheetStyle();
  const [selectId, setSelectId] = useState(value);
  const isShowButton = modal.getParam("isShowButton", true);
  const address = modal.getParam("address", false);
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState<any[]>(item || []);
  const onChange = modal.getParam("onChange", () => {});
  const inputRef = useRef<TextInput>(null);
  const [selectItems, setSelectItems] = useState<any[]>([]);
  const onSubmitPress = modal.getParam("onSubmitPress", () => {});
  const [
    searchAddress,
    { isLoading, isFetching },
  ] = useLazySearchAddressQuery();

  useEffect(() => {
    if (typeof value === "object") {
      setSelectItems(value);
    }
  }, [value]);

  const handleCheck = (selectItem: any) => {
    if (selectItems.some((checkedItem: any) => checkedItem === selectItem)) {
      setSelectItems((prevItems) =>
        prevItems?.filter((prevItem: any) => prevItem !== selectItem)
      );
    } else {
      setSelectItems((prevItems) => [...prevItems, selectItem]);
    }
  };

  const handleObjectCheck = (objectItem: SearchData | any) => {
    if (address) {
      closeModal(MODALS.bottomSheet);
      const addressData: string = [objectItem?.FlatNumber, objectItem?.Address1,
        objectItem?.Address2, objectItem?.City, objectItem?.PostalCode].filter(Boolean).join?.(", ");
      onChange?.(addressData.trim());
      onSubmitPress?.(objectItem);
    } else if (!isShowButton) {
      onChange?.(objectItem?.id);
      onSubmitPress?.(objectItem?.id);
      closeModal(MODALS.bottomSheet);
    }
  };

  const onSearch = (onSearchValue: string) => {
    if (address) {
      const params: SearchParams = {
        access_code: SEARCH_ACCESS_CODE,
        postCode: onSearchValue,
      };
      if (onSearchValue?.replaceAll?.(' ', '')?.length < 5) {
        setData([]);
        return;
      }
      searchAddress(params).then((res) => {
        if (res?.data?.Status === 200) {
          setData(res.data.Data);
        } else {
          inputRef?.current?.focus?.();
          setData([]);
        }
      });
    } else {
      const onFilterData = item?.filter((onRenderItem: any) =>
        onRenderItem?.[`${nameKey}`]
          .toLowerCase()
          .includes(onSearchValue?.toLowerCase())
      );
      setData(onFilterData);
    }
  };

  const onPressConfirm = () => {
    try {
      if (type === "radio") {
        if (selectId) {
          onChange?.(selectId);
          onSubmitPress?.(selectId);
          closeModal(MODALS.bottomSheet);
        }
      } else {
        if (selectItems) {
          onChange?.(selectItems);
          onSubmitPress?.(selectItems);
          closeModal(MODALS.bottomSheet);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const onSelectPress = debounce((selectItem: any) => {
    type === "radio"
      ? setSelectId?.(selectItem?.id)
      : handleCheck?.(selectItem?.id);
    handleObjectCheck?.(selectItem);
  }, 10);

  const onSearchAddress = debounce((q: string) => {
    setSearchValue(q);
    onSearch(q);
  }, 2000);

  return {
    item,
    data,
    type,
    value,
    styles,
    colors,
    setData,
    address,
    nameKey,
    onChange,
    selectId,
    searchValue,
    selectItems,
    setSelectId,
    handleCheck,
    onSubmitPress,
    onPressConfirm,
    handleObjectCheck,
    isFetching,
    isLoading,
    isShowButton,
    dataType,
    onSelectPress,
    onSearchAddress,
    inputRef,
  };
};

export default useBottomSheet;
