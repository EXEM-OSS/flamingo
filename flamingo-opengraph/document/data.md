Canvas Data
===========

오픈그래프의 전체 캔버스의 데이터 입출력과 각 도형별 데이터 컨트롤에 대해 알아보겠습니다.

## toXML && toJSON

toXML && toJSON 은 캔버스에 그려진 모든 도형을 포함한 레이아웃 데이터를 xml 또는 Json 으로 반환합니다.

```
/**
*    Canvas 에 그려진 Shape 들을 OpenGraph XML 문자열로 export 한다.
*
* @return {String} XML 문자열
*/
canvas.toXML();

/**
* Canvas 에 그려진 Shape 들을 OpenGraph JSON 객체로 export 한다.
*
* @return {Object} JSON 포맷의 Object
*/
canvas.toJSON();
```

## loadXML && loadJSON

toXML && toJSON 이 캔버스의 레이아웃 데이터를 반환하는 것이라면, loadXML && loadJSON 은 역으로 이 데이터를 캔버스에 드로잉 해 주는 메소드입니다.

이때 기존에 캔버스에 그려진 모든 도형들은 clear 됩니다.

```
/**
* OpenGraph XML 문자열로 부터 Shape 을 드로잉한다.
*
* @param {String| Element} xml XML 문자열 또는 DOM Element
* @return {Object} {width, height, x, y, x2, y2}
*/
canvas.loadXML(xml);

/**
* JSON 객체로 부터 Shape 을 드로잉한다.
*
* @param {Object} json JSON 포맷의 Object
* @return {Object} {width, height, x, y, x2, y2}
*/
canvas.loadJSON(json)
```

## setCustomData && getCustomData

주어진 도형에 커스텀 데이터를 저장하거나 가져옵니다.

저장된 커스텀 데이터는 오픈그래프의 toJSON 메소드 또는 toXML 메소드로 전체 캔버스의 레이아웃을 출력할 때 함께 커스텀 데이터 역시 저장되며,
loadJSON 또는 loadXML 메소드로 캔버스의 레이아웃을 가져올 때 커스텀 데이터 역시 복원됩니다.

```
/**
* 주어진 Shape 엘리먼트에 커스텀 데이타를 저장한다.
*
* @param {Element|String} shapeElement Shape DOM Element or ID
* @param {Object} data JSON 포맷의 Object
*/
canvas.setCustomData(element,data);
/**
* 주어진 Shape 엘리먼트에 저장된 커스텀 데이터를 반환한다.
*
* @param {Element|String} shapeElement Shape DOM Element or ID
* @return {Object} JSON 포맷의 Object
*/
canvas.getCustomData(element,data);

var element = canvas.drawShape([100, 100], new OG.CircleShape(), [50, 50], null, 'CircleShape');

//커스텀 데이터를 저장한다.
canvas.setCustomData(element, {index: 0, name: 'myShape'});

//캔버스 레이아웃을 출력한다.
var json = canvas.toJSON();

//캔버스의 기존 요소를 삭제하고 레이아웃 데이터로 재구성한다.
canvas.loadJSON(json);

//주어진 아이디로 도형을 불러온다.
var reloadedShape = canvas.getElementById('CircleShape');

if (reloadedShape) {
    //커스텀 데이터가 복원되어 불러와진다.
    var customData = canvas.getCustomData(reloadedShape);
    console.log(customData);
}
```

## setExtCustomData && getExtCustomData

setCustomData && getCustomData 와 별개로 사용할 수 있는 확장 커스텀 데이터 메소드입니다.

마찬가지로 캔버스의 레이아웃을 가져오거나 불러올 때 복원됩니다.

```
/**
* 주어진 Shape 엘리먼트에 확장 커스텀 데이타를 저장한다.
*
* @param {Element|String} shapeElement Shape DOM Element or ID
* @param {Object} data JSON 포맷의 Object
*/
canvas.setExtCustomData(element,data);

/**
* 주어진 Shape 엘리먼트에 저장된 확장 커스텀 데이터를 반환한다.
*
* @param {Element|String} shapeElement Shape DOM Element or ID
* @return {Object} JSON 포맷의 Object
*/
canvas.getExtCustomData(element,data);
```

