import { createCommentVNode, defineComponent, getCurrentInstance } from 'vue'
import { VcComponentInternalInstance } from '@vue-cesium/utils/types'
import { useProviders } from '@vue-cesium/composables'
import { accessToken, ellipsoid, minimumLevel, maximumLevel, rectangle, credit } from '@vue-cesium/utils/cesium-props'
import { kebabCase } from '@vue-cesium/utils/util'

export default defineComponent({
  name: 'VcProviderImageryMapbox',
  props: {
    url: {
      type: String,
      default: 'https://api.mapbox.com/styles/v1/'
    },
    username: {
      type: String,
      default: 'mapbox'
    },
    styleId: String,
    ...accessToken,
    tilesize: {
      type: Number,
      default: 512
    },
    scaleFactor: Boolean,
    ...ellipsoid,
    ...minimumLevel,
    ...maximumLevel,
    ...rectangle,
    ...credit
  },
  emits: ['beforeLoad', 'ready', 'destroyed', 'readyPromise'],
  setup(props, ctx) {
    // state
    const instance = getCurrentInstance() as VcComponentInternalInstance
    instance.cesiumClass = 'MapboxStyleImageryProvider'
    useProviders(props, ctx, instance)
    return () => createCommentVNode(kebabCase(instance.proxy.$options.name))
  }
})
