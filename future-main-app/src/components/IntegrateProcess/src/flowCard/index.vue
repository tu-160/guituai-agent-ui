<script lang="tsx">
  import { defineComponent } from 'vue';
  import { NodeUtils } from '../helper/util';
  const isCondition = data => data.type === 'condition' || (data.type === 'approver' && (data.isInterflow || data.isBranchFlow));
  const notEmptyArray = arr => Array.isArray(arr) && arr.length > 0;
  const hasBranch = data => notEmptyArray(data.conditionNodes);
  const stopPro = e => e && e.stopPropagation();

  export default defineComponent({
    props: {
      data: { type: Object, required: true },
      formInfo: { type: Object },
      // 点击发布时需要校验节点数据完整性 此时打开校验模式
      verifyMode: { type: Boolean, default: true },
      isPreview: { type: Boolean, default: false },
    },
    emits: ['emits'],
    setup(props, { emit }) {
      function createNormalCard(conf) {
        const classList = ['flow-path-card'];
        if (conf.state) classList.push(conf.state);
        classList.push(conf.type + '-node');
        return (
          <section class={classList.join(' ')} onClick={eventLauncher.bind(null, 'edit', conf) as any}>
            <header class="header">
              <div class="title-box" style="height: 100%;width:190px;">
                <span class="title-text">{conf.properties.title}</span>
              </div>
              {!props.isPreview && conf.type !== 'getData' && (
                <div class="actions">
                  <i class="icon-ym icon-ym-nav-close icon" onClick={eventLauncher.bind(null, 'deleteNode', conf, props.data) as any}></i>
                </div>
              )}
            </header>
            <div class="body">
              <span class="text">{conf.content}</span>
            </div>
          </section>
        );
      }
      const createFunc = conf => createNormalCard(conf);
      const nodes = {
        start: createFunc,
        addData: createFunc,
        updateData: createFunc,
        deleteData: createFunc,
        dataInterface: createFunc,
        message: createFunc,
        getData: createFunc,
        launchFlow: createFunc,
        interflow: createFunc,
        branchFlow: createFunc,
        empty: _ => '',
        condition: function (conf) {
          return (
            <section class="flow-path-card condition" onClick={eventLauncher.bind(null, 'edit', conf) as any}>
              <header class="header">
                <div class="title-box" style="height:20px;width:160px;">
                  <span class="title-text">{conf.properties.title}</span>
                  <a-input vModel:value={conf.properties.title} class="title-input" onClick={e => stopPro(e)} />
                </div>
                {!props.isPreview && conf.type !== 'getData' && (
                  <div class="actions">
                    <i class="icon-ym icon-ym-nav-close icon" onClick={eventLauncher.bind(null, 'deleteNode', conf, props.data) as any}></i>
                  </div>
                )}
              </header>
              <div class="body">
                <div class="text">{conf.content}</div>
              </div>
            </section>
          );
        },
      };
      function addNodeButton(data, isBranch = false) {
        if (props.isPreview || data?.childNode?.type === 'getData') {
          return <div class="add-node-btn-box flex justify-center"></div>;
        }
        const isEmpty = data.type === 'empty';
        if (isEmpty && !isBranch) return '';
        const popoverSlots = {
          content: () => (
            <div class="add-popover-main">
              <div class="condition-box">
                <div class="condition-item">
                  <div class="condition-icon addData" onClick={eventLauncher.bind(null, 'addAddDataNode', data, isBranch) as any}>
                    <i class="icon-ym icon-ym-btn-add"></i>
                  </div>
                  新增数据
                </div>
                <div class="condition-item">
                  <div class="condition-icon updateData" onClick={eventLauncher.bind(null, 'addUpdateDataNode', data, isBranch) as any}>
                    <i class="icon-ym icon-ym-Refresh"></i>
                  </div>
                  更新数据
                </div>
                <div class="condition-item">
                  <div class="condition-icon deleteData" onClick={eventLauncher.bind(null, 'addDeleteDataNode', data, isBranch) as any}>
                    <i class="icon-ym icon-ym-delete"></i>
                  </div>
                  删除数据
                </div>
                <div class="condition-item">
                  <div class="condition-icon dataInterface" onClick={eventLauncher.bind(null, 'addDataInterfaceNode', data, isBranch) as any}>
                    <i class="icon-ym icon-ym-options"></i>
                  </div>
                  数据接口
                </div>
                <div class="condition-item">
                  <div class="condition-icon message" onClick={eventLauncher.bind(null, 'addMessageNode', data, isBranch) as any}>
                    <i class="icon-ym icon-ym-xitong"></i>
                  </div>
                  消息通知
                </div>
                <div class="condition-item">
                  <div class="condition-icon launchFlow" onClick={eventLauncher.bind(null, 'addLaunchFlowNode', data, isBranch) as any}>
                    <i class="icon-ym icon-ym-launch"></i>
                  </div>
                  发起审批
                </div>
              </div>
            </div>
          ),
        };
        return (
          <div class="add-node-btn-box flex justify-center">
            <div class="add-node-btn">
              <a-popover placement="right" trigger="click" overlayClassName="add-popover" v-slots={popoverSlots}>
                <button class="btn" type="button">
                  <i class="icon-ym icon-ym-btn-add icon"></i>
                </button>
              </a-popover>
            </div>
          </div>
        );
      }
      function addBranchButton(data) {
        if (props.isPreview) {
          return <span class="line"></span>;
        }
        if (NodeUtils.isConditionNode(data.conditionNodes[0])) {
          return (
            <button onClick={eventLauncher.bind(null, 'appendConditionNode', data) as any} class="btn">
              添加条件
            </button>
          );
        }
        if (NodeUtils.isInterflowNode(data.conditionNodes[0])) {
          return (
            <button onClick={eventLauncher.bind(null, 'appendInterflowNode', data) as any} class="btn">
              添加分流
            </button>
          );
        }
        if (NodeUtils.isBranchFlowNode(data.conditionNodes[0])) {
          return (
            <button onClick={eventLauncher.bind(null, 'appendBranchFlowNode', data) as any} class="btn">
              添加分支
            </button>
          );
        }
      }
      function NodeFactory(data) {
        if (!data) return;
        const showErrorTip = props.verifyMode && NodeUtils.checkNode(data) === false;
        let content = '请完善配置';
        let res: any[] = [],
          branchNode: any = '',
          selfNode = (
            <div class="node-wrap">
              <div
                class={`node-wrap-box ${data.type} ${NodeUtils.isInterflowNode(data) ? 'interflow' : ''}
                ${NodeUtils.isBranchFlowNode(data) ? 'branchFlow' : ''} ${showErrorTip ? 'error' : ''}`}>
                {!props.isPreview && (
                  <a-tooltip title={content}>
                    <div class="error-tip" onClick={eventLauncher.bind(null, 'edit', data) as any}>
                      !!!
                    </div>
                  </a-tooltip>
                )}
                {nodes[data.type](data)}
                {addNodeButton(data)}
              </div>
            </div>
          );

        if (hasBranch(data)) {
          // 如果节点是数组 一定为条件分支 添加分支样式包裹
          branchNode = (
            <div class="branch-wrap">
              <div class="branch-box-wrap">
                <div class="branch-box flex justify-center relative">
                  {addBranchButton(data)}
                  {data.conditionNodes.map(d => NodeFactory(d))}
                </div>
              </div>
              {addNodeButton(data, true)}
            </div>
          );
        }
        if (isCondition(data)) {
          return (
            <div class="col-box">
              <div class="center-line"></div>
              <div class="top-cover-line"></div>
              <div class="bottom-cover-line"></div>
              {selfNode}
              {branchNode}
              {NodeFactory(data.childNode)}
            </div>
          );
        }
        res.push(selfNode);
        branchNode && res.push(branchNode);
        data.childNode && res.push(NodeFactory(data.childNode));
        return res;
      }
      function addEndNode() {
        return <section class="end-node">结束</section>;
      }
      /**
       *事件触发器 统筹本组件所有事件并转发到父组件中
       * @param { Object } 包含event（事件名）和args（事件参数）两个参数
       */
      function eventLauncher(event, ...args) {
        stopPro(args[args.length - 1]);
        const list = ['appendBranch', 'appendBranchFlowBranch', 'appendInterflowBranch', 'addTimerNode'];
        if (list.includes(event) && args[args.length - 2]) return;
        // args.slice(0,-1) vue 会注入MouseEvent到最后一个参数 去除事件对象
        const param = { event, args: args.slice(0, -1) };
        emit('emits', param);
      }

      return () => {
        return (
          <div style="display: inline-flex; flex-direction: column; align-items: center;">
            {props.data && NodeFactory(props.data)}
            {addEndNode()}
          </div>
        );
      };
    },
  });
</script>
