import { ref, computed, unref } from 'vue';
import { cloneDeep } from 'lodash-es';

export function useRedo() {
  const recordList = ref<any[]>([]);
  const currentRecordIndex = ref(-1);
  const recordLimit = ref(500);

  const getCanUndo = computed(() => currentRecordIndex.value > 0);
  const getCanRedo = computed(() => recordList.value.length > currentRecordIndex.value + 1);

  const initRedo = (limit = 500) => {
    recordList.value = [];
    currentRecordIndex.value = -1;
    recordLimit.value = limit;
  };
  // 新增一条历史纪录
  const addRecord = item => {
    if (currentRecordIndex.value + 1 < recordList.value.length) {
      recordList.value.splice(currentRecordIndex.value + 1);
    }
    recordList.value.push(cloneDeep(item));
    currentRecordIndex.value++;
    // 限制undo纪录步数
    if (recordList.value.length > recordLimit.value) {
      recordList.value.shift();
      currentRecordIndex.value--;
    }
  };

  const handleUndo = callback => {
    if (!unref(getCanUndo)) return;
    currentRecordIndex.value--;
    const currRecord = recordList.value[currentRecordIndex.value];
    callback(currRecord);
  };
  const handleRedo = callback => {
    if (!unref(getCanRedo)) return;
    currentRecordIndex.value++;
    const currRecord = recordList.value[currentRecordIndex.value];
    callback(currRecord);
  };

  return { initRedo, addRecord, handleUndo, handleRedo, getCanUndo, getCanRedo };
}
