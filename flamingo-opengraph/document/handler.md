Handler
=======

핸들러 클래스는 오픈그래프에서 사용자가 ui 를 통해 발생시키는 이벤트 비지니스 로직을 담당하고 있으며, canvas.getEventHandler() 를 통해 얻을 수 있습니다.

```
var canvas = new OG.Canvas('canvas', [400, 400], 'white', 'url(resources/images/symbol/grid.gif)');
var eventHandler = canvas.getEventHandler();
```

핸들러 클래스의 api 를 직접 제어하거나 접근하는 것은 오픈그래프 개발자 영역이며, 
Api reference 문서의 EventHandler 파트를 통해 개발에 참조하시길 바랍니다.