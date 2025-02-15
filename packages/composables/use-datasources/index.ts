import { VcComponentInternalInstance } from '@vue-cesium/utils/types'
import useCommon from '../use-common'
import { mergeDescriptors } from '@vue-cesium/utils/merge-descriptors'
import { onUnmounted, provide, watch } from 'vue'
import { vcKey } from '@vue-cesium/utils/config'
import cloneDeep from 'lodash/cloneDeep'
import differenceBy from 'lodash/differenceBy'

export default function (props, ctx, vcInstance: VcComponentInternalInstance) {
  // state
  vcInstance.cesiumEvents = ['changedEvent', 'errorEvent', 'loadingEvent']
  if (vcInstance.cesiumClass === 'KmlDataSource') {
    vcInstance.cesiumEvents.push('refreshEvent')
    vcInstance.cesiumEvents.push('unsupportedNodeEvent')
  }
  vcInstance.cesiumMembersEvents = [
    {
      name: 'clock',
      events: ['definitionChanged']
    },
    {
      name: 'clustering',
      events: ['clusterEvent']
    },
    {
      name: 'entities',
      events: ['collectionChanged']
    }
  ]
  const commonState = useCommon(props, ctx, vcInstance)
  // watcher
  vcInstance.alreadyListening.push('entities')
  let unwatchFns = []
  unwatchFns.push(watch(
    () => cloneDeep(props.entities),
    (newVal, oldVal) => {
      if (!vcInstance.mounted) {
        return
      }
      const datasource = vcInstance.cesiumObject as Cesium.DataSource

      if (newVal.length === oldVal.length) {
        // 视为修改操作
        // Treated as modified
        const modifies = []
        for (let i = 0; i < newVal.length; i++) {
          const options = newVal[i]
          const oldOptions = oldVal[i]

          if (JSON.stringify(options) !== JSON.stringify(oldOptions) ) {
            modifies.push({
              newOptions: options,
              oldOptions: oldOptions
            })
          }
        }

        modifies.forEach(v => {
          const modifyEntity = datasource.entities.getById(v.oldOptions.id)
          if (v.oldOptions.id === v.newOptions.id) {
            modifyEntity && Object.keys(v.newOptions).forEach(prop => {
              if (v.oldOptions[prop] !== v.newOptions[prop]) {
                modifyEntity[prop] = commonState.transformProp(prop, v.newOptions[prop])
              }
            })
          } else {
            // 改了 id
            datasource.entities.remove(modifyEntity)
            const entityOptions = v.newOptions
            const entityOptionsTransform = commonState.transformProps(entityOptions)
            const entityAdded = datasource.entities.add(entityOptionsTransform)
            entityAdded.id !== entityOptions.id && (entityOptions.id = entityAdded.id)
          }
        })
      } else {
        const adds: any = differenceBy(newVal, oldVal, 'id')
        const deletes: any = differenceBy(oldVal, newVal, 'id')
        const deletedEntities = []
        for (let i = 0; i < deletes.length; i++) {
          const deleteEntity = datasource.entities.getById(deletes[i].id)
          deletedEntities.push(deleteEntity)
        }

        deletedEntities.forEach(v => {
          datasource.entities.remove(v)
        })

        for (let i = 0; i < adds.length; i++) {
          const entityOptions = adds[i]
          const entityOptionsTransform = commonState.transformProps(entityOptions)
          const entityAdded = datasource.entities.add(entityOptionsTransform)
          entityAdded.id !== entityOptions.id && (entityOptions.id = entityAdded.id)
        }
      }
    },
    {
      deep: true
    }
  ))
  // methods
  vcInstance.mount = async () => {
    const dataSources = commonState.$services.dataSources
    const datasource = vcInstance.cesiumObject as Cesium.DataSource
    datasource.show = props.show
    for (let i = 0; i < props.entities.length; i++) {
      const entityOptions = props.entities[i]
      const entityOptionsTransform = commonState.transformProps(entityOptions)
      const entity = datasource.entities.add(entityOptionsTransform)
      entityOptions.id !== entity.id && (entityOptions.id = entity.id)
    }
    return dataSources.add(datasource).then(() => {
      return true
    })
  }
  vcInstance.unmount = async () => {
    const dataSources = commonState.$services.dataSources
    const datasource = vcInstance.cesiumObject as Cesium.DataSource
    return dataSources && dataSources.remove(datasource)
  }

  const getServices = () => {
    return mergeDescriptors(commonState.getServices(), {
      get datasource () {
        return vcInstance.cesiumObject as Cesium.DataSource
      },
      get entities () {
        return (vcInstance.cesiumObject as Cesium.DataSource)?.entities
      }
    })
  }

  // life cycle
  onUnmounted(() => {
    unwatchFns.forEach(item => item())
    unwatchFns = []
  })

  // provide
  provide(vcKey, getServices())

  // expose public methods
  Object.assign(vcInstance.proxy, {
    createPromise: commonState.createPromise,
    load: commonState.load,
    unload: commonState.unload,
    reload: commonState.reload,
    cesiumObject: vcInstance.cesiumObject,
    getCesiumObject: () => vcInstance.cesiumObject
  })

  return {
    transformProps: commonState.transformProps,
    unwatchFns: commonState.unwatchFns,
    setPropsWatcher: commonState.setPropsWatcher
  }
}
