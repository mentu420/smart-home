;(window._iconfont_svg_string_4211536 =
  '<svg><symbol id="icon-close" viewBox="0 0 1024 1024"><path d="M661.33306602 88.78125518c206.38421807 72.96487471 330.19602099 284.01240234 293.17046747 499.77942363C917.49670771 804.30897325 730.43994131 962.01872773 511.50786172 962.01872773S105.51901572 804.32770098 68.51218994 588.56067881C31.48663643 372.81238526 155.29843935 161.74612989 361.68265742 88.78125518a37.45630107 37.45630107 0 1 1 25.09572217 70.60512743C214.7790456 220.17795927 111.58693613 396.05402041 142.43220019 575.86299277c30.84526406 179.79024463 186.71966016 311.24313281 369.16930195 311.24313369 182.43091406 0 338.32403877-131.43416045 369.16930284-311.26186143 30.84526406-179.79024463-72.34684541-355.64757802-244.3461794-416.45788242A37.45630107 37.45630107 0 0 1 661.33306602 88.78125518zM511.50786172 399.10670879a37.45630107 37.45630107 0 0 1-37.45630107-37.45630108V99.45630107a37.45630107 37.45630107 0 1 1 74.91260214 0v262.19410664a37.45630107 37.45630107 0 0 1-37.45630107 37.45630107z" fill="#000000" ></path></symbol></svg>'),
  (function (n) {
    var t = (t = document.getElementsByTagName('script'))[t.length - 1],
      e = t.getAttribute('data-injectcss'),
      t = t.getAttribute('data-disable-injectsvg')
    if (!t) {
      var o,
        i,
        c,
        d,
        a,
        s = function (t, e) {
          e.parentNode.insertBefore(t, e)
        }
      if (e && !n.__iconfont__svg__cssinject__) {
        n.__iconfont__svg__cssinject__ = !0
        try {
          document.write(
            '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>'
          )
        } catch (t) {
          console && console.log(t)
        }
      }
      ;(o = function () {
        var t,
          e = document.createElement('div')
        ;(e.innerHTML = n._iconfont_svg_string_4211536),
          (e = e.getElementsByTagName('svg')[0]) &&
            (e.setAttribute('aria-hidden', 'true'),
            (e.style.position = 'absolute'),
            (e.style.width = 0),
            (e.style.height = 0),
            (e.style.overflow = 'hidden'),
            (e = e),
            (t = document.body).firstChild ? s(e, t.firstChild) : t.appendChild(e))
      }),
        document.addEventListener
          ? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState)
            ? setTimeout(o, 0)
            : ((i = function () {
                document.removeEventListener('DOMContentLoaded', i, !1), o()
              }),
              document.addEventListener('DOMContentLoaded', i, !1))
          : document.attachEvent &&
            ((c = o),
            (d = n.document),
            (a = !1),
            r(),
            (d.onreadystatechange = function () {
              'complete' == d.readyState && ((d.onreadystatechange = null), l())
            }))
    }
    function l() {
      a || ((a = !0), c())
    }
    function r() {
      try {
        d.documentElement.doScroll('left')
      } catch (t) {
        return void setTimeout(r, 50)
      }
      l()
    }
  })(window)
