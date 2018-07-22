export const batchProps = {
  type: String,
  count: Number
}

const TYPE = {
  TREE: 'tree',
  STAGE: 'stage'
}

export default {
  name: 'batch',
  props: batchProps,
  abstract: true,
  render () {
    return this.$slots.default[0]
  },
  beforeUpdate () {
    console.log('======= beforeUpdate =======')

    if (this.$tasker) {
      let type = this.type || (this.type = 'stage')
      console.log('update type: ', type)
      switch (type) {
        case TYPE.TREE:
          this.$tasker.close()
          break
        case TYPE.STAGE:
          this.$tasker.store(this.count)
          break
      }
    }

    console.log('======= beforeUpdate end =======')
  },
  updated () {
    console.log('======= updated =======')
    let type = this.type

    switch (type) {
      case TYPE.TREE:
        let treeTask = [{
          module: 'dom',
          method: 'updateElement',
          args: [
            this.$el.ref,
            this.$el.toJSON()
          ]
        }]
        this.$tasker.open(treeTask)
        break
      case TYPE.STAGE:
        this.$tasker.open()
        break
    }
    console.log('======= updated end =======')
  }
}
