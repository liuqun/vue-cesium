import { VcComponentInternalInstance } from '@vue-cesium/utils/types'
import { defineComponent, getCurrentInstance, createCommentVNode } from 'vue'
import { useGeometries } from '@vue-cesium/composables'
import { kebabCase } from '@vue-cesium/utils/util'
import {
  positions,
  width,
  colors,
  arcType,
  granularity,
  vertexFormat,
  ellipsoid
} from '@vue-cesium/utils/cesium-props'
export default defineComponent({
  name: 'VcGeometryPolyline',
  props: {
    ...positions,
    ...width,
    ...colors,
    colorsPerVertex: {
      type: Boolean,
      default: false
    },
    ...arcType,
    ...granularity,
    ...vertexFormat,
    ...ellipsoid
  },
  emits: ['beforeLoad', 'ready', 'destroyed'],
  setup (props, ctx) {
    // state
    const instance = getCurrentInstance() as VcComponentInternalInstance
    instance.cesiumClass = 'PolylineGeometry'
    useGeometries(props, ctx, instance)

    return () => createCommentVNode(kebabCase(instance.proxy.$options.name))
  }
})
