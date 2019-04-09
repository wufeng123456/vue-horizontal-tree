const innerUrl = require('../../assets/inner-join.png')
const leftUrl = require('../../assets/left-join.png')
// const rightUrl = require('components/org-tree/right-join.png')
const errorUrl = require('../../assets/error-join.png')
const delUrl = require('../../assets/chacha.png')
// 判断是否叶子节点
const isLeaf = (data, prop) => {
  return !(Array.isArray(data[prop]) && data[prop].length > 0)
}

// 创建 node 节点
export const renderNode = (h, data, context) => {
  const {props} = context
  const cls = ['org-tree-node']
  const childNodes = []
  const children = data[props.props.children]
  const dragstart = context.listeners['on-dragstart']
  const dragover = context.listeners['on-dragover']
  const drop = context.listeners['on-drop']
  if (isLeaf(data, props.props.children)) {
    cls.push('is-leaf')
  } else if (props.collapsable && !data[props.props.expand]) {
    cls.push('collapsed')
  }
  if (!data.root) {
    // childNodes.push(renderDel(h, data, context));
    childNodes.push(renderRelation(h, data, context))
  }
  childNodes.push(renderLabel(h, data, context))

  if (!props.collapsable || data[props.props.expand]) {
    childNodes.push(renderChildren(h, children, context))
  }

  return h('div', {
    domProps: {
      className: cls.join(' '),
      draggable: !data.root
    },
    on: {
      dragstart: e => {
        e.stopPropagation()
        dragstart && dragstart(e, data)
      },
      dragover: e => {
        e.stopPropagation()
        dragover && dragover(e, data)
      },
      drop: e => {
        e.stopPropagation()
        drop && drop(e, data)
      }
    }
  }, childNodes)
}

// 创建展开折叠按钮
export const renderBtn = (h, data, context) => {
  const {props} = context
  const expandHandler = context.listeners['on-expand']

  let cls = ['org-tree-node-btn']

  if (data[props.props.expand]) {
    cls.push('expanded')
  }

  return h('span', {
    domProps: {
      className: cls.join(' ')
    },
    on: {
      click: e => {
        e.stopPropagation()
        expandHandler && expandHandler(data)
      }
    }
  })
}
// 创建删除root按钮
export const renderDelRoot = (h, data, context) => {
  const clickHandler = context.listeners['on-del-child']
  return h('div', {
    domProps: {
      className: 'del-root'
    },
    on: {
      click: e => {
        e.stopPropagation()
        clickHandler && clickHandler(e, data)
      }
    }
  }, [h('img', {
    // style: {width: labelWidth},
    attrs: {
      src: delUrl
    }
  })])
}

// 创建 label 节点
export const renderLabel = (h, data, context) => {
  const {props} = context
  const label = data[props.props.label]
  const renderContent = props.renderContent
  const clickHandler = context.listeners['on-node-click']

  const childNodes = []
  if (typeof renderContent === 'function') {
    let vnode = renderContent(h, data)

    vnode && childNodes.push(vnode)
  } else {
    childNodes.push(label)
  }
  // if (data.children && data.children.length > 1 || data.root) {
  childNodes.push(renderDelRoot(h, data, context))
  // }
  if (props.collapsable && !isLeaf(data, props.props.children)) {
    childNodes.push(renderBtn(h, data, context))
  }

  const cls = ['org-tree-node-label-inner']
  cls.push(data.label)
  let {labelWidth, labelClassName} = props
  if (typeof labelWidth === 'number') {
    labelWidth += 'px'
  }
  if (typeof labelClassName === 'function') {
    labelClassName = labelClassName(data)
  }
  labelClassName && cls.push(labelClassName)
  return h('div', {
    domProps: {
      className: 'org-tree-node-label'
    }
  }, [h('div', {
    domProps: {
      className: cls.join(' ')
    },
    style: {width: labelWidth},
    on: {
      click: e => clickHandler && clickHandler(e, data)
    }
  }, childNodes)])
}
// 创建del节点
export const renderDel = (h, data, context) => {
  const {props} = context
  const label = data[props.props.label]
  const renderContent = props.renderContent
  const clickHandler = context.listeners['on-del-click']

  const childNodes = []
  if (typeof renderContent === 'function') {
    let vnode = renderContent(h, data)

    vnode && childNodes.push(vnode)
  } else {
    childNodes.push(label)
  }

  if (props.collapsable && !isLeaf(data, props.props.children)) {
    childNodes.push(renderBtn(h, data, context))
  }
  return h('div', {
    domProps: {
      className: 'org-tree-node-del'
    }
  }, [h('a', {
    // style: {width: labelWidth},
    on: {
      click: e => clickHandler && clickHandler(e, data)
    }
  }, childNodes)])
}

// 创建 relation 节点
export const renderRelation = (h, data, context) => {
  let url = ''
  if (data.joinType === 0) {
    url = innerUrl
  } else if (data.joinType === 1) {
    url = leftUrl
  } else {
    url = errorUrl
  }
  const {props} = context
  const label = data[props.props.label]
  const renderContent = props.renderContent
  const clickHandler = context.listeners['on-relation-click']

  const childNodes = []
  if (typeof renderContent === 'function') {
    let vnode = renderContent(h, data)

    vnode && childNodes.push(vnode)
  } else {
    childNodes.push(label)
  }

  if (props.collapsable && !isLeaf(data, props.props.children)) {
    childNodes.push(renderBtn(h, data, context))
  }

  // const cls = ['iconClass']
  // const btnNodes = []
  // let {labelWidth, labelClassName} = props
  // if (typeof labelWidth === 'number') {
  //   labelWidth += 'px'
  // }
  // if (typeof labelClassName === 'function') {
  //   labelClassName = labelClassName(data)
  // }
  // labelClassName && cls.push(labelClassName)
  return h('div', {
    domProps: {
      className: 'org-tree-node-relation'
    }
  }, [h('img', {
    attrs: {
      src: url
    },
    // style: {width: labelWidth},
    on: {
      click: e => clickHandler && clickHandler(e, data)
    }
  }, childNodes)])
}

// 创建 node 子节点
export const renderChildren = (h, list, context) => {
  if (Array.isArray(list) && list.length) {
    const children = list.map(item => {
      return renderNode(h, item, context)
    })

    return h('div', {
      domProps: {
        className: 'org-tree-node-children'
      }
    }, children)
  }
  return ''
}

export const render = (h, context) => {
  const {props} = context
  return renderNode(h, props.data, context)
}

export default render
