# mapbox

## container

- 地图容器的 id

## center

- 地图的中心点

## zoom

- 地图当前的缩放级数

## style 一些配置项

- version 指的是 mapbox 的版本号
- name 指的是 地图的样式名称标注
- sprite 其实就是雪碧图 主要是将图标拼接成一张图片
- glyphs 主要是地图上面的字体
- source
  -

# mapbox Example

## flyTo() 飞至某一位置

```JS
map.flyTo({
    center: [-74.5 + (Math.random() - 0.5) * 10, 40 + (Math.random() - 0.5) * 10],
    essential: true,
    zoom: 15,
})
```

- center 飞入到达的点位
- essential 不理解啥意思 官方解释是 `If a user has the `reduced motion`accessibility feature enabled in their operating system, the animation will be skipped and this will behave equivalently to`jumpTo`, unless 'options' includes `essential: true`.`
- zoom 飞入时地图放大的级别

## 添加一个图片

```JS
map.on('load', () => {
    // 加载image
    map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/cat.png', (error, image) => {
        if (error) throw error

        // 添加一个图片资源
        map.addImage('cat', image)

        // 添加一个点位
        map.addSource('point', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [-77.4144, 25.0759],
                        },
                    },
                ],
            },
        })

        // 将图片资源放置在点位上
        map.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'point', // 引用的资源 就是上面addSource的point
            layout: {
                'icon-image': 'cat', // reference the image
                'icon-size': 0.25,
            },
        })
    })
})
```

- coordinates 渲染图片的位置点
- icon-image addImage 的时候绑定了一个 name 示例中为`cat`
- icon-size 设置图片渲染最终的尺寸

## 渲染一个多边形

```JS
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [-68.137343, 45.137451], // starting position
    zoom: 5, // starting zoom
})

map.on('load', () => {
    // 添加一个多边形资源
    map.addSource('maine', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                // 组成多边形的具体点位
                coordinates: [
                    [
                        [-67.13734, 45.13745],
                        [-66.96466, 44.8097],
                        [-68.03252, 44.3252],
                        [-69.06, 43.98],
                        [-70.11617, 43.68405],
                        [-70.64573, 43.09008],
                        [-70.75102, 43.08003],
                        [-70.79761, 43.21973],
                        [-70.98176, 43.36789],
                        [-70.94416, 43.46633],
                        [-71.08482, 45.30524],
                        [-70.66002, 45.46022],
                        [-70.30495, 45.91479],
                        [-70.00014, 46.69317],
                        [-69.23708, 47.44777],
                        [-68.90478, 47.18479],
                        [-68.2343, 47.35462],
                        [-67.79035, 47.06624],
                        [-67.79141, 45.70258],
                        [-67.13734, 45.13745],
                    ],
                ],
            },
        },
    })

    // 将多边形资源添加到一个新的图层上
    map.addLayer({
        id: 'maine',
        type: 'fill',
        source: 'maine', // reference the data source
        layout: {},
        paint: {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5,
        },
    })
    // 将多边形资源添加到一个渲染线边框的图层上
    map.addLayer({
        id: 'outline',
        type: 'line',
        source: 'maine',
        layout: {},
        paint: {
            'line-color': '#000',
            'line-width': 3,
        },
    })
})
```

- coordinates 传入绘制多边形的点位数组 多边形是由一个个点连起来 最终绘制成的一个闭合图形 需要注意的是第一个点和最后一个点重合达到最终闭合的目的
- fill-color 遮罩层的填充颜色
- fill-opacity 遮罩层的透明度
- line-color 边框线的颜色
- line-width 边框线的宽度

## 为点添加动画效果

```JS
var radius = 20

function pointOnCircle(angle) {
    return {
        type: 'Point',
        coordinates: [Math.cos(angle) * radius, Math.sin(angle) * radius],
    }
}

map.on('load', function () {
    // Add a source and layer displaying a point which will be animated in a circle.
    map.addSource('point', {
        type: 'geojson',
        data: pointOnCircle(0),
    })

    map.addLayer({
        id: 'point',
        source: 'point',
        type: 'circle',
        paint: {
            'circle-radius': 10,
            'circle-color': '#007cbf',
        },
    })

    function animateMarker(timestamp) {
        // Update the data to a new position based on the animation timestamp. The
        // divisor in the expression `timestamp / 1000` controls the animation speed.
        map.getSource('point').setData(pointOnCircle(timestamp / 1000))

        // Request the next frame of the animation.
        requestAnimationFrame(animateMarker)
    }

    // Start the animation.
    animateMarker(0)
})
```

-

## jumpTo() 直接跳跃到某一个位置

- center 点位
- zoom 缩放级别
- pitch 视角
- bearing 方位角

```js
const cityCoordinates = [
  [100.507, 13.745],
  [98.993, 18.793],
  [99.838, 19.924],
  [102.812, 17.408],
  [100.458, 7.001],
  [100.905, 12.935],
];
map.on('load', () => {
  // 在多个点位中 按照时间间隔跳跃
  for (const [index, coordinate] of cityCoordinates.entries()) {
    setTimeout(() => {
      map.jumpTo({ center: coordinate });
    }, 2000 * index);
  }
});
```

## CameraOptions

- 共有选项 [Map#jumpTo](http://www.mapbox.cn/mapbox-gl-js/api/#mapjumpto)，[Map#easeTo](http://www.mapbox.cn/mapbox-gl-js/api/#mapeaseto)，和[Map#flyTo](http://www.mapbox.cn/mapbox-gl-js/api/#mapflyto)， 控制默认位置、缩放级别、方位角和倾斜度。 所有属性均可选。 未指定的选项将默认设为当前地图该属性的值。

- **center**`(LngLatLike)`: 预设的中心。（lng、lat 指经纬度）
- **zoom** 预设的缩放级别
- **bearing** 预设的方位角（bearing，rotation），按照逆时针偏离正北方的度数计算。
- **pitch** 预设的倾斜度（pitch，tilt），单位为度。

- **around** 如果 `zoom` 是确定的 `around` 将决定缩放中心（默认为地图中心）。

## 键盘上下左右控制地图视角

```JS
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-87.6298, 41.8781],
    zoom: 17,
    bearing: -12,
    pitch: 60,
    interactive: false,
})

// 按前后键时平移的距离单位
const deltaDistance = 100

// 按左右键时方位转换的角度单位
const deltaDegrees = 25

function easing(t) {
    return t * (2 - t)
}

map.on('load', () => {
    map.getCanvas().focus()

    map.getCanvas().addEventListener(
        'keydown',
        (e) => {
            e.preventDefault()
            if (e.which === 38) {
                // up
                map.panBy([0, -deltaDistance], {
                    easing: easing,
                })
            } else if (e.which === 40) {
                // down
                map.panBy([0, deltaDistance], {
                    easing: easing,
                })
            } else if (e.which === 37) {
                // left
                map.easeTo({
                    bearing: map.getBearing() - deltaDegrees,
                    easing: easing,
                })
            } else if (e.which === 39) {
                // right
                map.easeTo({
                    bearing: map.getBearing() + deltaDegrees,
                    easing: easing,
                })
            }
        },
        true
    )
})
```

# panBy()

- 用于平移视角

```JS
function easing(t) {
    return t * (2 - t)
}
map.panBy([0, -deltaDistance], {
    easing: easing,
})
```

## 渲染一串点集

```JS
map.on('load', () => {
    // 加载图片
    map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
            if (error) throw error
            map.addImage('custom-marker', image)
            // 添加多个资源点
            map.addSource('points', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            // feature for Mapbox DC
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [-77.03238901390978, 38.913188059745586],
                            },
                            properties: {
                                title: 'Mapbox DC',
                            },
                        },
                        {
                            // feature for Mapbox SF
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [-122.414, 37.776],
                            },
                            properties: {
                                title: 'Mapbox SF',
                            },
                        },
                    ],
                },
            })

            // 新建一个图层
            map.addLayer({
                id: 'points',
                type: 'symbol',
                source: 'points',
                layout: {
                    'icon-image': 'custom-marker',
                    // 获取资源的title属性
                    'text-field': ['get', 'title'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, 1.25],
                    'text-anchor': 'top',
                },
            })
            map.on('click','points',(e)=>{
                console.log(e.features[0].properties)
            })
        }
    )
})
```

- 图层类型为 symbol 用于渲染多个 icon 时使用。更多 layer 类型见[Layers API ](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)

## easeTo() 动态转换

- 主要用来动态更换方位角

```js
map.easeTo({
  bearing: map.getBearing() - deltaDegrees,
  easing: easing,
});
```
