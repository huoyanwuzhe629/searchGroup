<!-- <div id="filterContext" style="margin-left: 50px"> -->
    <h3>过滤项</h3>
    <div>
        <div style="display: inline-block;">
            <label for="groupName">组名称：</label>
            <input type="text" id="groupName" style="margin:10px;height: 25px" value="{{params.groupName}}">
        </div>
        <div style="line-height: 41px;margin-left: 40px;display: inline-block;">
            <label for="area">投放地域：</label>
            <input type="radio" id="allArea" value="allArea" name="area" title="全部地域" {{#isAllArea}}checked{{/isAllArea}} />
            <input type="radio" id="selectArea" value="selectArea" name="area" title="选择地域" {{#isSelectArea}}checked{{/isSelectArea}}/>
            <input type="checkbox" id="beijing" value="beijing" name="city" title="北京" {{#isBeijing}}checked{{/isBeijing}} {{#isAllArea}}disabled{{/isAllArea}}/>
            <input type="checkbox" id="tianjin" value="tianjin" name="city" title="天津" {{#isTianjin}}checked{{/isTianjin}} {{#isAllArea}}disabled{{/isAllArea}}/>
        </div>
    </div>
    <div>
        <div style="display: inline-block;">
            <label for="channel">频&nbsp;&nbsp;&nbsp;道：</label>
            <select id="channel" style="margin:10px;width: 173px;height: 25px" value="{{params.channel}}">
                <option value="shoppingSearch">购物搜索</option>
                <option value="dsp">dsp</option>
                <option value="sohu">搜狐微门户</option>
                <option value="qqNav">qq导航页</option>
                <option value="sogouPhoneticize">搜狗拼音</option>
            </select>
        </div>
        <div style="line-height: 39px;margin-left: 40px;display: inline-block;">
            <label for="beginTime">开始时间：</label>
            <input type="text" class="calendar" id="beginTime" style="height: 25px" value="{{params.beginTime}}" />
            <label for="endTime" style="margin-left: 10px">结束时间：</label>
            <input type="text" class="calendar" id="endTime" style="height: 25px" value="{{params.endTime}}" />
        </div>
    </div>
    <div>
        <div style="display: inline-block;;">
            <label for="groupPrice">组出价：</label>
            <input type="text" name="groupPrice" id="priceFrom" style="margin:10px;width: 65px;height: 25px" value="{{params.priceFrom}}">
            <span>--</span>
            <input type="text" name="groupPrice" id="priceTo" style="margin:10px;width: 65px;height: 25px" value="{{params.priceTo}}">
        </div>
    </div>
    <div class="control">
        <button id="search">查询</button>
        <button id="clear" style="margin-left: 10px">清空</button>
    </div>

