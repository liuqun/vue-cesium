## VcGraphicsBillboard

Loading a billboard graphic. It is equivalent to initializing a `Cesium.BillboardGraphics` instance.

**Note:** It needs to be a subcomponent of `vc-entity` to load normally.

### Basic usage

Basic usage of VcGraphicsBillboard component.

:::demo Use the `vc-graphics-billboard` tag to add a billboard with entity on the viwewer.

```html
<el-row ref="viewerContainer" class="demo-viewer">
  <vc-viewer>
    <!-- Load through attributes and load subcomponents separately -->
    <vc-entity ref="entity" :position="position" @click="onEntityEvt" @mouseover="onEntityEvt" @mouseout="onEntityEvt">
      <vc-graphics-billboard
        ref="billboard"
        :image="image"
        :scale="scale"
        :show="show"
        :distanceDisplayCondition="distanceDisplayCondition"
        :horizontalOrigin="horizontalOrigin"
      ></vc-graphics-billboard>
    </vc-entity>
  </vc-viewer>
  <el-row class="demo-toolbar">
    <el-button type="danger" round @click="unload">Unload</el-button>
    <el-button type="danger" round @click="load">Load</el-button>
    <el-button type="danger" round @click="reload">Reload</el-button>
    <el-switch v-model="show" active-color="#13ce66" inactive-text="Show/Hide"> </el-switch>
  </el-row>
</el-row>

<script>
  import { ref, getCurrentInstance, onMounted } from 'vue'
  export default {
    setup() {
      // state
      const image = 'https://zouyaoji.top/vue-cesium/favicon.png'
      const position = { lng: 90, lat: 40, height: 10000 } // [90, 40, 10000]
      const distanceDisplayCondition = { near: 0, far: 20000000 }
      const horizontalOrigin = 0
      const scale = ref(0.25)
      const show = ref(true)
      const entity = ref(null)
      const billboard = ref(null)
      // methods
      const onEntityEvt = e => {
        console.log(e)
        if (e.type === 'onmouseover') {
          scale.value = 0.5
        } else if (e.type === 'onmouseout') {
          scale.value = 0.25
        }
      }
      const unload = () => {
        billboard.value.unload()
      }
      const reload = () => {
        billboard.value.reload()
      }
      const load = () => {
        billboard.value.load()
      }
      // life cycle
      onMounted(() => {
        entity.value.createPromise.then(({ Cesium, viewer, cesiumObject }) => {
          viewer.zoomTo(cesiumObject)
        })
      })

      return {
        image,
        position,
        distanceDisplayCondition,
        horizontalOrigin,
        scale,
        show,
        onEntityEvt,
        unload,
        reload,
        load,
        billboard,
        entity
      }
    }
  }
</script>
```

:::

### Props

<!-- prettier-ignore -->
| Name | Type | Default | Description | Accepted Values |
| ---- | ---- | ------- | ----------- | --------------- |
| show | Boolean | `true` | `optional` A boolean Property specifying the visibility of the billboard. |
| image | String\|Object | | `optional` A Property specifying the Image, URI, or Canvas to use for the billboard. |
| scale | Number | `1.0` | `optional` A numeric Property specifying the scale to apply to the image size. |
| pixelOffset | Object\|Array\|Function | `{x: 0, y: 0}` | `optional` A Cartesian2 Property specifying the pixel offset. |
| eyeOffset | Object\|Array\|Function | `{x: 0, y: 0, z: 0}` | `optional` A Cartesian3 Property specifying the eye offset. |
| horizontalOrigin | Number | `0` | `optional` A Property specifying the HorizontalOrigin. **CENTER: 0, LEFT: 1, RIGHT: -1** |0/1/-1|
| verticalOrigin | Number | `0` | `optional` A Property specifying the VerticalOrigin. **CENTER: 0, BOTTOM: 1, BASELINE: 2, TOP: -1** |0/1/2/-1|
| heightReference | Number | `0` | `optional` A Property specifying what the height is relative to. **NONE: 0, CLAMP_TO_GROUND: 1, RELATIVE_TO_GROUND: 2** |0/1/2|
| color | Color | `'white'` | `optional` A Property specifying the tint Color of the image. |
| rotation | Number | `0` | `optional` A numeric Property specifying the rotation about the alignedAxis. |
| alignedAxis | Object\|Array\|Function | `{x: 0, y: 0, z: 0}` | `optional` A Cartesian3 Property specifying the unit vector axis of rotation. |
| sizeInMeters | Boolean | | `optional` A boolean Property specifying whether this billboard's size should be measured in meters. |
| width | Number | | `optional` A numeric Property specifying the width of the billboard in pixels, overriding the native size. |
| height | Number | | `optional` A numeric Property specifying the height of the billboard in pixels, overriding the native size. |
| scaleByDistance | Object\|Array\|Function | | `optional` A NearFarScalar Property used to scale the point based on distance from the camera. |
| translucencyByDistance | Object\|Array\|Function | | `optional` A NearFarScalar Property used to set translucency based on distance from the camera. |
| pixelOffsetScaleByDistance | Object\|Array\|Function | | `optional` A NearFarScalar Property used to set pixelOffset based on distance from the camera. |
| imageSubRegion | Object | | `optional` A Property specifying a BoundingRectangle that defines a sub-region of the image to use for the billboard, rather than the entire image, measured in pixels from the bottom-left. |
| distanceDisplayCondition | Object\|Array\|Function | | `optional` A Property specifying at what distance from the camera that this billboard will be displayed. |
| disableDepthTestDistance | Number | | `optional` A Property specifying the distance from the camera at which to disable the depth test to. |

### Events

| Name              | Parameters                         | Description                                                          |
| ----------------- | ---------------------------------- | -------------------------------------------------------------------- |
| beforeLoad        | Vue Instance                       | Triggers before the cesiumObject is loaded.                          |
| ready             | {Cesium, viewer, cesiumObject, vm} | Triggers when the cesiumObject is successfully loaded.               |
| destroyed         | Vue Instance                       | Triggers when the cesiumObject is destroyed.                         |
| definitionChanged |                                    | Triggers whenever a property or sub-property is changed or modified. |

### Reference

- Refer to the official documentation: **[BillboardGraphics](https://cesium.com/docs/cesiumjs-ref-doc/BillboardGraphics.html)**
