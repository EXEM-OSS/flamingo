Renderer
========

렌더러 클래스는 오픈그래프의 실제 drawing 비지니스 로직을 담당하고 있으며, canvas.getRender() 를 통해 얻을 수 있습니다.

```
var canvas = new OG.Canvas('canvas', [400, 400], 'white', 'url(resources/images/symbol/grid.gif)');
var renderer = canvas.getRender();
```

렌더러 클래스의 api 를 직접 제어하거나 접근하는 것은 오픈그래프 개발자 영역이며, 
Api reference 문서의 IRenderer, RaphaelRenderer 파트를 통해 개발에 참조하시길 바랍니다. 