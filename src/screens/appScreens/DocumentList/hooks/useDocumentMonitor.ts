import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../../../constants/routeConstant';
import {
  useDeleteDocumentMutation,
  useFetchDocumentsQuery,
} from '../../../../services/appServices';
import {createRef, useEffect, useState} from 'react';
import {SwipeListView} from 'react-native-swipe-list-view';

const useDocumentMonitor = () => {
  const {data, isLoading, isFetching, refetch} = useFetchDocumentsQuery();
  const swipeRef = createRef<SwipeListView<any>>();
  const [deleteDocument] = useDeleteDocumentMutation();
  const navigation = useNavigation<any>();
  const [listData, setListData] = useState(data ?? []);

  const [groupData, setGroupData] = useState(data ?? []);

  useEffect(() => {
    if (data?.statusCode === 200) {
      setListData(data?.data || []);

      const groupedDataLocal = data?.data?.reduce((acc, currentItem) => {
        const {monitorField} = currentItem;
        if (!acc[monitorField]) {
          acc[monitorField] = [];
        }
        acc[monitorField].push(currentItem);
        return acc;
      }, {});

      setGroupData(groupedDataLocal ?? []);
    }
  }, [data]);

  const onPressAdd = (item?: {}) => {
    swipeRef?.current?.closeAllOpenRows?.();
    navigation.navigate(ROUTES.addDocuments, {
      item,
    });
  };

  const onDelete = (id: string) => {
    swipeRef?.current?.closeAllOpenRows?.();
    deleteDocument(id);
  };

  return {
    onPressAdd,
    listData,
    isLoading,
    isFetching,
    refetch,
    onDelete,
    swipeRef,
    SwipeListView,
    groupData,
  };
};

export default useDocumentMonitor;
