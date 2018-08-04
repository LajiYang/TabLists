# TabLists
React实现移动端TabLlists组件，点击tabItem实现动画效果居中

参数：
tabLists传入数组，要显示的各item文本
activeTab 当前激活的item的索引值
setActiveTab 设置activeTab的函数
isAnimation 是否要动画 true为有，false为没有
使用：
<TabLists
tabLists={tabLists}
activeTab={activeTab}
setActiveTab={setActiveTab}
isAnimation={true}
/>
