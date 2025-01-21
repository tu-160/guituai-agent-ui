import { defineStore } from 'pinia';
import { treeToList } from '@/utils/helper/treeHelper';

export const useOrganizeStore = defineStore({
  id: 'app-organize',
  state: () => ({
    organizeList: [],
    organizeTree: [],
    positionList: [],
    positionTree: [],
    groupList: [],
    groupTree: [],
    roleList: [],
    roleTree: [],
  }),
  getters: {},
  actions: {
    resetState() {
      this.organizeList = [];
      this.organizeTree = [];
      this.positionList = [];
      this.positionTree = [];
      this.groupList = [];
      this.groupTree = [];
      this.roleList = [];
      this.roleTree = [];
    },
    async getOrganizeTree(): Promise<any[]> {
      try {
        if (this.organizeTree.length) return this.organizeTree;
        const res =  null;  // await getDepartmentSelector();
        if (!res) return [];
        this.organizeTree = res.data.list;
        this.organizeList = treeToList(this.organizeTree);
        return this.organizeTree;
      } catch (error) {
        return [];
      }
    },
    async getOrganizeList(): Promise<any[]> {
      try {
        const list = this.organizeTree.length ? this.organizeTree : await this.getOrganizeTree();
        this.organizeList = treeToList(list);
        return this.organizeList;
      } catch (error) {
        return [];
      }
    },
    async getPositionTree(): Promise<any[]> {
      try {
        if (this.positionTree.length) return this.positionTree;
        const res = null; // await getPositionSelector();
        if (!res) return [];
        this.positionTree = res.data.list;
        return this.positionTree;
      } catch (error) {
        return [];
      }
    },
    async getPositionList(): Promise<any[]> {
      try {
        if (this.positionList.length) return this.positionList;
        const res = null;// await getPositionListAll();
        if (!res) return [];
        this.positionList = res.data.list;
        return this.positionList;
      } catch (error) {
        return [];
      }
    },
    async getGroupTree(): Promise<any[]> {
      try {
        if (this.groupTree.length) return this.groupTree;
        const res = null; // await getGroupSelector();
        if (!res) return [];
        this.groupTree = res.data;
        return this.groupTree;
      } catch (error) {
        return [];
      }
    },
    async getGroupList(): Promise<any[]> {
      try {
        const list = this.groupTree.length ? this.groupTree : await this.getGroupTree();
        this.groupList = treeToList(list, { type: 'group' });
        return this.groupList;
      } catch (error) {
        return [];
      }
    },
    async getRoleTree(): Promise<any[]> {
      try {
        if (this.roleTree.length) return this.roleTree;
        const res = null; // await getRoleSelector();
        if (!res) return [];
        this.roleTree = res.data.list;
        return this.roleTree;
      } catch (error) {
        return [];
      }
    },
    async getRoleList(): Promise<any[]> {
      try {
        const list = this.roleTree.length ? this.roleTree : await this.getRoleTree();
        this.roleList = treeToList(list, { type: 'role' });
        return this.roleList;
      } catch (error) {
        return [];
      }
    },
  },
});
