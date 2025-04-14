export const helpTipContent = {
  wechat: (
    <div className="p-2 shadow-xl">
      <p>例如：MP_4234567890</p>
    </div>
  ),
  twitter: (
    <div className="p-2 shadow-xl">
      <p>Twitter的ID可以在用户名下方@字段后找到</p>
      <img
        src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/%E6%88%AA%E5%B1%8F2024-10-30%2016.14.47.jpg"
        alt="twitter"
      />
    </div>
  ),
  weibo: (
    <div className="p-2 shadow-xl">
      <p>
        请前往
        <a href="https://weibo.com/" className="text-blue-500" target="_blank">
          网页版微博
        </a>
        ，进入用户主页
        <br />
        url最末尾的数字即为标志ID
      </p>
      <img
        className="w-96"
        src="https://loosand-picture.oss-cn-hangzhou.aliyuncs.com/blog/%E6%88%AA%E5%B1%8F2024-10-30%2016.09.50.jpg"
        alt="weibo"
      />
    </div>
  ),
  rss: (
    <div className="p-2 shadow-xl">
      <p>
        请输入RSS源的URL地址
        <br />
        例如：https://example.com/feed.xml
      </p>
    </div>
  ),
}
