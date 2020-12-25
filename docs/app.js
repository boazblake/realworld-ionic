(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("Http.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parseHttpSuccess = exports.parseHttpError = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var api = "https://conduit.productionready.io/api/";

var onProgress = mdl => e => {
  if (e.lengthComputable) {
    mdl.state.loadingProgress.max = e.total;
    mdl.state.loadingProgress.value = e.loaded;
    m.redraw();
  }
};

function onLoad() {
  return false;
}

var onLoadStart = mdl => e => {
  mdl.state.isLoading = true;
  return false;
};

var onLoadEnd = mdl => e => {
  mdl.state.isLoading = false;
  mdl.state.loadingProgress.max = 0;
  mdl.state.loadingProgress.value = 0;
  return false;
};

var xhrProgress = mdl => ({
  config: xhr => {
    xhr.onprogress = onProgress(mdl);
    xhr.onload = onLoad;
    xhr.onloadstart = onLoadStart(mdl);
    xhr.onloadend = onLoadEnd(mdl);
  }
});

var parseHttpError = mdl => rej => e => {
  mdl.state.isLoading = false;
  return rej(e.response.errors);
};

exports.parseHttpError = parseHttpError;

var parseHttpSuccess = mdl => res => data => {
  mdl.state.isLoading = false;
  return res(data);
};

exports.parseHttpSuccess = parseHttpSuccess;

var getUserToken = () => sessionStorage.getItem("token") ? {
  authorization: sessionStorage.getItem("token")
} : "";

var call = _headers => method => mdl => url => body => {
  if (["POST", "PUT", "DELETE"].includes(method) && !mdl.state.isLoggedIn()) {
    if (!["/login", "/register"].includes(mdl.slug)) {
      return Task.rejected(m.route.set("/register"));
    }
  }

  mdl.state.isLoading = true;
  return new Task((rej, res) => m.request(_objectSpread({
    method,
    url: api + url,
    headers: _objectSpread({
      "content-type": "application/json"
    }, _headers),
    body,
    withCredentials: false
  }, xhrProgress(mdl))).then(parseHttpSuccess(mdl)(res), parseHttpError(mdl)(rej)));
};

var Http = {
  getTask: mdl => url => call(getUserToken())("GET")(mdl)(url)(null),
  deleteTask: mdl => url => call(getUserToken())("DELETE")(mdl)(url)(null),
  postTask: mdl => url => data => call(getUserToken())("POST")(mdl)(url)(data),
  putTask: mdl => url => data => call(getUserToken())("PUT")(mdl)(url)(data)
};
var _default = Http;
exports.default = _default;
});

;require.register("Utils.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorViewModel = exports.sanitizeImg = exports.log = void 0;

var log = m => v => {
  console.log(m, v);
  return v;
};

exports.log = log;

var secureImg = url => url.match(/(https)./) ? url : url.replace("http", "https");

var sanitizeImg = url => url && url.match(/\.(jpeg|jpg|gif|png|svg)$/) ? secureImg(url) : "https://static.productionready.io/images/smiley-cyrus.jpg";

exports.sanitizeImg = sanitizeImg;

var errorViewModel = err => Object.keys(err).map(k => ({
  key: k.toUpperCase(),
  values: err[k]
}));

exports.errorViewModel = errorViewModel;
});

;require.register("components/articles.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Articles = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var favoriteArticleUrl = slug => "articles/".concat(slug, "/favorite");

var favoriteArticleTask = http => mdl => slug => http.postTask(mdl)(favoriteArticleUrl(slug))();

var unFavoriteArticleTask = http => mdl => slug => http.deleteTask(mdl)(favoriteArticleUrl(slug));

var ArticlePreview = (_ref) => {
  var {
    attrs: {
      mdl,
      article
    }
  } = _ref;
  var data = article;

  var toggleArticleLike = (favorited, slug) => {
    var onError = (0, _Utils.log)("toggleArticleLike err-art");

    var onSuccess = (_ref2) => {
      var {
        article: {
          favorited,
          favoritesCount
        }
      } = _ref2;
      data.favorited = favorited;
      data.favoritesCount = favoritesCount;
    };

    var toggle = favorited ? unFavoriteArticleTask : favoriteArticleTask;
    toggle(_Http.default)(mdl)(slug).fork(onError, onSuccess);
  };

  return {
    view: () => {
      return m("ion-item", {
        button: true
      }, m("ion-grid", [m("ion-row", m("ion-col", m(m.route.Link, {
        class: "preview-link",
        href: "/article/".concat(data.slug)
      }, m("ion-text", m("h1", data.title)), m("ion-text", m("p", data.description))))), m("ion-row", m("ion-col", m("ion-list", {
        side: "end"
      }, data.tagList.map(tag => m("ion-chip", tag))))), m("ion-row", [m(m.route.Link, {
        href: "/profile/".concat(data.author.username),
        options: {
          replace: true
        }
      }, m("ion-avatar", {
        slot: "start"
      }, m("img", {
        src: (0, _Utils.sanitizeImg)(data.author.image)
      }))), m("ion-label", m("ion-text", m("h2", data.author.username)), m("p", data.createdAt)), m("ion-chip", {
        onclick: e => toggleArticleLike(data.favorited, data.slug)
      }, [m("ion-icon", {
        name: data.favorited ? "heart-dislike-outline" : "heart-outline"
      }), m("ion-text", data.favoritesCount)])])]));
    }
  };
};

var Articles = () => {
  return {
    view: (_ref3) => {
      var {
        attrs: {
          mdl,
          data
        }
      } = _ref3;
      return data.articles.length ? m("ion-list", data.articles.map(article => m(ArticlePreview, {
        mdl,
        data,
        article
      }))) : m("p", "No articles are here... yet.");
    }
  };
};

exports.Articles = Articles;
});

;require.register("components/banner.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Banner = void 0;

var Banner = () => {
  return {
    view: (_ref) => {
      var {
        children
      } = _ref;
      return m(".banner", m(".container", children));
    }
  };
};

exports.Banner = Banner;
});

;require.register("components/card.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Card = void 0;
var Card = {
  view: (_ref) => {
    var {
      attrs: {
        options,
        header,
        content,
        footer
      }
    } = _ref;
    return m("ion-card", options, m("ion-card-header", {
      translucent: true
    }, header), m("ion-card-content", content), m("ion-card-footer", footer));
  }
};
exports.Card = Card;
});

;require.register("components/comments.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Comments = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getCommentsTask = http => mdl => slug => http.getTask(mdl)("articles/".concat(slug, "/comments"));

var deleteCommentTask = http => mdl => slug => id => http.deleteTask(mdl)("articles/".concat(slug, "/comments/").concat(id));

var trimBody = (0, _ramda.over)((0, _ramda.lensProp)("body"), _ramda.trim);

var submitTask = http => mdl => comment => http.postTask(mdl)("articles/".concat(mdl.slug, "/comments"))({
  comment
});

var CommentForm = (_ref) => {
  var {
    attrs: {
      mdl,
      reload
    }
  } = _ref;
  var comment = {
    body: ""
  };
  var state = {
    errors: [],
    disabled: false
  };

  var onError = errors => {
    state.errors = (0, _Utils.errorViewModel)(errors);
    console.log("Error with form ", state);
    state.disabled = false;
  };

  var onSuccess = () => {
    comment.body = "";
    state.errors = [];
    state.disabled = false;
    reload();
  };

  var submit = comment => submitTask(_Http.default)(mdl)(trimBody(comment)).fork(onError, onSuccess);

  return {
    oninit: () => comment.body = "",
    view: (_ref2) => {
      var {
        attrs: {
          mdl
        }
      } = _ref2;
      return [m("ion-grid", m("ion-row", m("ion-col", m("ion-textarea", {
        rows: 3,
        placeholder: "Write a comment ...",
        onchange: e => comment.body = e.target.value,
        disabled: state.disabled,
        value: comment.body
      }))), m("ion-row", m("ion-col", m("ion-avatar", m("img", {
        src: (0, _Utils.sanitizeImg)(mdl.user.image)
      }))), m("ion-col", m("ion-button", {
        onclick: e => {
          state.disabled = true;
          submit(comment);
        }
      }, " Post Comment ")))), state.errors.map(e => e.values.map(err => m("p.error-messages", "".concat(e.key, " ").concat(err))))];
    }
  };
};

var Comment = () => {
  return {
    view: (_ref3) => {
      var {
        attrs: {
          mdl,
          comment: {
            author: {
              image,
              username
            },
            body,
            createdAt,
            id
          },
          deleteComment
        }
      } = _ref3;
      return m("ion-item", m("ion-grid", ("ion-row", m("ion-text", body)), m("ion-row", m(m.route.Link, {
        href: "/profile/".concat(username),
        class: "comment-author m-5"
      }, m("ion-avatar", m("img", {
        src: (0, _Utils.sanitizeImg)(image)
      })), m("ion-text", username)), m("ion-text", createdAt), username == mdl.user.username && m("ion-icon", {
        name: "trash-outline",
        onclick: e => deleteComment(id)
      }))));
    }
  };
};

var Comments = (_ref4) => {
  var {
    attrs: {
      mdl
    }
  } = _ref4;
  var data = {
    comments: []
  };

  var loadComments = mdl => {
    var onSuccess = (_ref5) => {
      var {
        comments
      } = _ref5;
      return data.comments = comments;
    };

    var onError = (0, _Utils.log)("error with comments");
    getCommentsTask(_Http.default)(mdl)(mdl.slug).fork(onError, onSuccess);
  };

  var _deleteComment = id => {
    var onSuccess = (_ref6) => {
      var {
        comments
      } = _ref6;
      return data.comments = comments;
    };

    var onError = (0, _Utils.log)("error with comments");
    deleteCommentTask(_Http.default)(mdl)(mdl.slug)(id).chain(x => getCommentsTask(_Http.default)(mdl)(mdl.slug)).fork(onError, onSuccess);
  };

  return {
    oninit: (_ref7) => {
      var {
        attrs: {
          mdl
        }
      } = _ref7;
      return loadComments(mdl);
    },
    view: (_ref8) => {
      var {
        attrs: {
          mdl
        }
      } = _ref8;
      return m("item-list", m(CommentForm, {
        mdl,
        reload: () => loadComments(mdl)
      }), data.comments.map(c => m(Comment, {
        mdl,
        comment: c,
        deleteComment: id => _deleteComment(id)
      })));
    }
  };
};

exports.Comments = Comments;
});

;require.register("components/feed-nav.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeedNav = void 0;

var FeedNav = (_ref) => {
  var {
    attrs: {
      fetchData
    }
  } = _ref;
  return {
    view: (_ref2) => {
      var {
        attrs: {
          mdl,
          data
        }
      } = _ref2;
      return [m("ion-toolbar", m("ion-row", mdl.state.isLoggedIn() && m("ion-col", m("ion-button", {
        fill: "solid",
        expand: "full",
        id: "feed",
        color: data.tags.current == "feed" ? "primary" : "secondary",
        onclick: e => {
          console.log("data.tags.current", e.target.id, e);
          data.tags.current = e.target.id;
          fetchData(mdl);
        }
      }, "Your Feed")), m("ion-col", m("ion-button", {
        fill: "solid",
        expand: "full",
        id: "",
        color: data.tags.current == "" ? "primary" : "secondary",
        onclick: e => {
          data.tags.current = e.target.id;
          fetchData(mdl);
        }
      }, "Global Feed"))), m("ion-row", m("ion-col", data.tags.selected.map(tag => m("ion-button", {
        fill: "solid",
        size: "small",
        color: data.tags.current == tag ? "primary" : "secondary",
        id: tag,
        onclick: e => {
          data.tags.current = tag;
          fetchData(mdl);
        }
      }, m("ion-text", "# ".concat(tag)) //Move this to user profile
      // import { without } from "ramda"
      // m("ion-icon", {
      //   name: "close-circle-outline",
      //   onclick: (e) =>
      //     (data.tags.selected = without(tag, data.tags.selected)),
      // })
      )))))];
    }
  };
};

exports.FeedNav = FeedNav;
});

;require.register("components/follow-favorite.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FollowFavorite = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deleteArticleUrl = slug => "articles/".concat(slug);

var favoriteArticleUrl = slug => "articles/".concat(slug, "/favorite");

var followAuthorUrl = author => "profiles/".concat(author, "/follow");

var deleteArticleTask = http => mdl => http.deleteTask(mdl)(deleteArticleUrl(mdl.slug));

var favoriteArticleTask = http => mdl => http.postTask(mdl)(favoriteArticleUrl(mdl.slug))();

var unFavoriteArticleTask = http => mdl => http.deleteTask(mdl)(favoriteArticleUrl(mdl.slug));

var followAuthorTask = http => mdl => author => http.postTask(mdl)(followAuthorUrl(author))();

var unFollowAuthorTask = http => mdl => author => http.deleteTask(mdl)(followAuthorUrl(author));

var FollowFavorite = (_ref) => {
  var {
    attrs: {
      mdl,
      data
    }
  } = _ref;

  var toggleArticleLike = (_ref2) => {
    var {
      favorited
    } = _ref2;
    var onError = (0, _Utils.log)("toggleArticleLike err-art");

    var onSuccess = (_ref3) => {
      var {
        article: {
          favorited,
          favoritesCount
        }
      } = _ref3;
      data.favorited = favorited;
      data.favoritesCount = favoritesCount;
    };

    var toggle = favorited ? unFavoriteArticleTask : favoriteArticleTask;
    toggle(_Http.default)(mdl).fork(onError, onSuccess);
  };

  var toggleAuthorFollow = (_ref4) => {
    var {
      author: {
        username,
        following
      }
    } = _ref4;
    var onError = (0, _Utils.log)("toggleAuthorFollow, err-auth");

    var onSuccess = (_ref5) => {
      var {
        profile: {
          following
        }
      } = _ref5;
      return data.author.following = following;
    };

    var toggle = following ? unFollowAuthorTask : followAuthorTask;
    toggle(_Http.default)(mdl)(username).fork(onError, onSuccess);
  };

  var deleteArticle = slug => {
    var onError = (0, _Utils.log)("deleteArticle, err-auth");

    var onSuccess = s => {
      console.log(s);
      m.route.set("/home");
    };

    deleteArticleTask(_Http.default)(mdl).fork(onError, onSuccess);
  };

  return {
    view: (_ref6) => {
      var {
        attrs: {
          mdl,
          data: {
            author: {
              username,
              image,
              following
            },
            favoritesCount,
            favorited,
            slug
          }
        }
      } = _ref6;
      return m("ion-grid", m("ion-row", [m(m.route.Link, {
        href: "profile/".concat(username)
      }, m("ion-chip", m("ion-avatar", m("ion-img", {
        src: (0, _Utils.sanitizeImg)(image)
      })), m("ion-text", username))), mdl.user.username == username ? [m(m.route.Link, {
        class: "btn btn-sm btn-outline-secondary",
        href: "/editor/".concat(slug),
        selector: "button"
      }, [m("ion-icon", {
        name: "edit"
      }), "Edit Article"]), m("ion-button", {
        onclick: e => deleteArticle(slug)
      }, [m("ion-icon", {
        name: "trash-outline"
      }), "Delete Article "])] : [m("ion-chip", {
        onclick: e => toggleAuthorFollow(data)
      }, [m("ion-icon", {
        name: following ? "people-circle-outline" : "people-outline"
      }), m("ion-label", "".concat(username))]), m("ion-chip", {
        onclick: e => toggleArticleLike(data)
      }, [m("ion-icon", {
        name: favorited ? "heart-dislike-outline" : "heart-outline"
      }), m("ion-label", favoritesCount)])]]));
    }
  };
};

exports.FollowFavorite = FollowFavorite;
});

;require.register("components/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _banner = require("./banner");

Object.keys(_banner).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _banner[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _banner[key];
    }
  });
});

var _loader = require("./loader");

Object.keys(_loader).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _loader[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _loader[key];
    }
  });
});

var _paginator = require("./paginator");

Object.keys(_paginator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _paginator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _paginator[key];
    }
  });
});

var _articles = require("./articles");

Object.keys(_articles).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _articles[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _articles[key];
    }
  });
});

var _followFavorite = require("./follow-favorite");

Object.keys(_followFavorite).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _followFavorite[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _followFavorite[key];
    }
  });
});

var _comments = require("./comments");

Object.keys(_comments).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _comments[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _comments[key];
    }
  });
});

var _feedNav = require("./feed-nav");

Object.keys(_feedNav).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _feedNav[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _feedNav[key];
    }
  });
});

var _sidebar = require("./sidebar");

Object.keys(_sidebar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _sidebar[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _sidebar[key];
    }
  });
});

var _card = require("./card");

Object.keys(_card).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _card[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _card[key];
    }
  });
});
});

;require.register("components/loader.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Loader = void 0;

var Loader = () => {
  return {
    view: (_ref) => {
      var {
        children
      } = _ref;
      return m(".container", m(".banner", m(".container", children)));
    }
  };
};

exports.Loader = Loader;
});

;require.register("components/paginator.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Paginator = void 0;

var Paginator = () => {
  return {
    view: (_ref) => {
      var {
        attrs: {
          state,
          fetchDataFor
        }
      } = _ref;
      var total = Math.ceil(state.total / state.limit) + 1;
      var current = state.offset / state.limit + 1;
      var range = [...Array(total).keys()].slice(1);
      return state.total > state.limit && range.map((page, idx) => {
        return m("ion-chip", {
          color: page == current && "primary",
          onclick: e => fetchDataFor(idx * state.limit)
        }, page);
      });
    }
  };
};

exports.Paginator = Paginator;
});

;require.register("components/sidebar.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SideBar = void 0;

var _ramda = require("ramda");

var SideBar = () => {
  var selectTag = (data, tag) => data.tags.selected = (0, _ramda.uniq)(data.tags.selected.concat([tag]));

  return {
    view: (_ref) => {
      var {
        attrs: {
          data
        }
      } = _ref;

      var isSelected = tag => data.tags.selected.includes(tag) ? "primary" : "secondary";

      return [m("ion-text", "Popular Tags"), data.tags.tagList.filter(tag => !data.tags.selected.includes(tag)).map(tag => m("ion-chip", {
        color: isSelected(tag),
        onclick: e => selectTag(data, tag)
      }, tag))];
    }
  };
};

exports.SideBar = SideBar;
});

;require.register("index.js", function(exports, require, module) {
"use strict";

var _routes = _interopRequireDefault(require("./routes.js"));

var _model = _interopRequireDefault(require("./model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = document.body;
var winW = window.innerWidth;

if (module.hot) {
  module.hot.accept();
}

if ('development' !== "production") {
  console.log("Looks like we are in development mode!");
} else {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").then(registration => {
        console.log("⚙️ SW registered: ", registration);
      }).catch(registrationError => {
        console.log("🧟 SW registration failed: ", registrationError);
      });
    });
  }
} // set display profiles


var getProfile = w => {
  if (w < 668) return "phone";
  if (w < 920) return "tablet";
  return "desktop";
};

var checkWidth = winW => {
  var w = window.innerWidth;

  if (winW !== w) {
    winW = w;
    var lastProfile = _model.default.settings.profile;
    _model.default.settings.profile = getProfile(w);
    if (lastProfile != _model.default.settings.profile) m.redraw();
  }

  return requestAnimationFrame(checkWidth);
};

_model.default.settings.profile = getProfile(winW);
checkWidth(winW);

if (sessionStorage.getItem("user")) {
  _model.default.user = JSON.parse(sessionStorage.getItem("user"));
}

m.route(root, "/home", (0, _routes.default)(_model.default));
});

;require.register("initialize.js", function(exports, require, module) {
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  require("./index.js");
});
});

;require.register("layout/footer.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Footer = () => {
  return {
    view: () => m("ion-footer", m("div", {
      class: "container"
    }, [m("a", {
      class: "logo-font",
      href: "https://github.com/gothinkster/realworld"
    }, "conduit"), m("span", {
      class: "attribution"
    }, [" An interactive learning project from ", m("a", {
      href: "https://thinkster.io"
    }, "Thinkster"), ". Code ", m.trust("&amp;"), " design licensed under MIT. "])]))
  };
};

var _default = Footer;
exports.default = _default;
});

;require.register("layout/header.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Header = () => {
  return {
    view: (_ref) => {
      var {
        attrs: {
          mdl
        }
      } = _ref;
      return m("ion-header", m("ion-toolbar", m("ion-buttons", {
        slot: "start"
      }, m("ion-back-button"), m("ion-menu-button")), m("a.navbar-brand", {
        href: "#"
      }, "conduit"), m("ul.nav navbar-nav pull-xs-right", mdl.state.isLoggedIn() ? [m("li.nav-item", m(m.route.Link, {
        class: "nav-link",
        href: "/settings/".concat(mdl.user.username)
      }, [m("i.ion-gear-a.p-5"), "Settings"])), m("li.nav-item", m(m.route.Link, {
        class: "nav-link",
        href: "/profile/".concat(mdl.user.username)
      }, mdl.user.username))] : [m("li.nav-item", m(m.route.Link, {
        class: "nav-link",
        href: "/register"
      }, "Sign up")), m("li.nav-item", m(m.route.Link, {
        class: "nav-link",
        href: "/login"
      }, "Login"))])));
    }
  };
};

var _default = Header;
exports.default = _default;
});

;require.register("layout/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _header = _interopRequireDefault(require("./header.js"));

var _footer = _interopRequireDefault(require("./footer.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Layout = () => {
  return {
    view: (_ref) => {
      var {
        children,
        attrs: {
          mdl
        }
      } = _ref;
      return m("ion-app", m(_header.default, {
        mdl
      }), m("ion-content", children), m(_footer.default, {
        mdl
      }));
    }
  };
};

var _default = Layout;
exports.default = _default;
});

;require.register("layout/info.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var info = () => {
  return {
    view: () => m("footer", m("div", {
      class: "container"
    }, [m("a", {
      class: "logo-font",
      href: "https://github.com/gothinkster/realworld"
    }, "conduit"), m("span", {
      class: "attribution"
    }, [" An interactive learning project from ", m("a", {
      href: "https://thinkster.io"
    }, "Thinkster"), ". Code ", m.trust("&amp;"), " design licensed under MIT. "])]))
  };
};

var _default = info;
exports.default = _default;
});

;require.register("model.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var model = {
  state: {
    isLoading: false,
    loadingProgress: {
      max: 0,
      value: 0
    },
    isLoggedIn: () => sessionStorage.getItem("token")
  },
  settings: {},
  page: "",
  user: {}
};
var _default = model;
exports.default = _default;
});

;require.register("pages/article.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _components = require("components");

var _marked = _interopRequireDefault(require("marked"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getArticleTask = http => mdl => slug => http.getTask(mdl)("articles/".concat(slug));

var Article = () => {
  var data = {};
  var state = {
    status: "loading",
    error: null
  };

  var onSuccess = (_ref) => {
    var {
      article,
      comments
    } = _ref;
    data.article = article;
    data.comments = comments;
    state.status = "success";
  };

  var onError = error => {
    console.log("error", error);
    state.error = error;
    state.status = "error";
  };

  var loadData = mdl => {
    state.status = "loading";
    getArticleTask(_Http.default)(mdl)(mdl.slug).fork(onError, onSuccess);
  };

  return {
    oninit: (_ref2) => {
      var {
        attrs: {
          mdl
        }
      } = _ref2;
      return loadData(mdl);
    },
    view: (_ref3) => {
      var {
        attrs: {
          mdl
        }
      } = _ref3;
      return [state.status == "loading" && m(_components.Banner, [m("h1.logo-font", "Loading ...")]), state.status == "error" && m(_components.Banner, [m("h1.logo-font", "Error Loading Data: ".concat(state.error))]), state.status == "success" && [m("ion-text", m("h1", data.article.title)), m("ion-text", m.trust((0, _marked.default)(data.article.body))), m(_components.FollowFavorite, {
        mdl,
        data: data.article
      }), // m("ion-item-divider"),
      m(_components.Comments, {
        mdl,
        comments: data.comments,
        reloadArticle: () => loadData(mdl)
      })]];
    }
  };
};

var _default = Article;
exports.default = _default;
});

;require.register("pages/editor.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.submitArticleTask = exports.loadArticleTask = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadArticleTask = http => mdl => slug => http.getTask(mdl)("articles/".concat(slug));

exports.loadArticleTask = loadArticleTask;
var formatTags = (0, _ramda.over)((0, _ramda.lensProp)("tagList"), (0, _ramda.compose)(_ramda.uniq, (0, _ramda.split)(" "), _ramda.trim));

var submitArticleTask = http => mdl => article => http.postTask(mdl)("articles")({
  article
});

exports.submitArticleTask = submitArticleTask;

var Editor = (_ref) => {
  var {
    attrs: {
      mdl
    }
  } = _ref;
  var data = {
    description: "",
    title: "",
    body: "",
    tagList: ""
  };
  var state = {
    disabled: false
  };

  var initEditor = mdl => {
    state.disabled = false;

    var onSuccess = (_ref2) => {
      var {
        article
      } = _ref2;
      return data = article;
    };

    var onError = errors => state.errors = (0, _Utils.errorViewModel)(errors);

    if (mdl.slug !== "/editor") {
      loadArticleTask(_Http.default)(mdl)(mdl.slug).fork(onError, onSuccess);
    }
  };

  var submitData = data => {
    state.disabled = true;

    var onSuccess = (_ref3) => {
      var {
        article: {
          slug
        }
      } = _ref3;
      return m.route.set("/article/".concat(slug));
    };

    var onError = errors => {
      state.errors = (0, _Utils.errorViewModel)(errors);
      state.disabled = false;
    };

    submitArticleTask(_Http.default)(mdl)(data).fork(onError, onSuccess);
  };

  return {
    oninit: (_ref4) => {
      var {
        attrs: {
          mdl
        }
      } = _ref4;
      return initEditor(mdl);
    },
    view: () => m(".editor-page", m(".container.page", m(".row", m(".col-md-10.offset-md-1.col-xs-12", m("form", [state.errors && state.errors.map(e => m(".error-messages", m("ul", "".concat(e.key), e.values.map(error => m("li", error))))), m("fieldset.form-group", m("input.form-control.form-control-lg", {
      type: "text",
      disabled: state.disabled,
      placeholder: "Article Title",
      onchange: e => data.title = e.target.value,
      value: data.title
    })), m("fieldset.form-group", m("input.form-control.form-control-lg", {
      type: "text",
      disabled: state.disabled,
      placeholder: "What's this article about?",
      onchange: e => data.description = e.target.value,
      value: data.description
    })), m("fieldset.form-group", m("textarea.form-control.form-control-lg", {
      rows: 8,
      placeholder: "Write your article (in markdown)",
      disabled: state.disabled,
      onchange: e => data.body = e.target.value,
      value: data.body
    })), m("fieldset.form-group", m("input.form-control.form-control-lg", {
      type: "text",
      disabled: state.disabled,
      placeholder: "Enter tags",
      onchange: e => data.tagList = e.target.value,
      value: data.tagList
    })), m("button.btn-lg.pull-xs-right.btn-primary", {
      onclick: e => submitData(data)
    }, " Publish Article ")])))))
  };
};

var _default = Editor;
exports.default = _default;
});

;require.register("pages/home.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _components = require("components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getTagsTask = http => mdl => http.getTask(mdl)("tags");

var getArticlesTask = http => mdl => state => data => data.tags.current == "feed" ? http.getTask(mdl)("articles/feed?limit=20&offset=".concat(state.offset)) : http.getTask(mdl)("articles?limit=20&offset=".concat(state.offset, "&tag=").concat(data.tags.current));

var loadDataTask = http => mdl => state => data => Task.of(tags => articles => _objectSpread(_objectSpread({}, tags), articles)).ap(getTagsTask(http)(mdl)).ap(getArticlesTask(http)(mdl)(state)(data));

var Home = () => {
  var data = {
    tags: {
      tagList: [],
      selected: [],
      current: ""
    },
    articles: {}
  };
  var state = {
    feedStatus: "loading",
    pageStatus: "loading",
    limit: 20,
    offset: 0,
    total: 0,
    error: null
  };

  var loadInitData = mdl => {
    var onSuccess = (_ref) => {
      var {
        articles,
        articlesCount,
        tags
      } = _ref;
      data.articles = articles;
      state.total = articlesCount;
      data.tags.tagList = tags;
      state.pageStatus = "success";
      state.feedStatus = "success";
    };

    var onError = error => {
      console.log("error", error);
      state.error = error;
      state.pageStatus = "error";
    };

    state.pageStatus = "loading";
    loadDataTask(_Http.default)(mdl)(state)(data).fork(onError, onSuccess);
  };

  var loadArticles = mdl => {
    var onSuccess = (_ref2) => {
      var {
        articles,
        articlesCount
      } = _ref2;
      data.articles = articles;
      state.total = articlesCount;
      state.feedStatus = "success";
    };

    var onError = error => {
      console.log("error", error);
      state.error = error;
      state.feedStatus = "error";
    };

    state.feedStatus = "loading";
    getArticlesTask(_Http.default)(mdl)(state)(data).fork(onError, onSuccess);
  };

  return {
    oninit: (_ref3) => {
      var {
        attrs: {
          mdl
        }
      } = _ref3;
      return loadInitData(mdl);
    },
    view: (_ref4) => {
      var {
        attrs: {
          mdl
        }
      } = _ref4;
      return [!mdl.state.isLoggedIn() && m(_components.Banner, [m("h1.logo-font", "conduit"), m("p", "A place to share your knowledge.")]), state.pageStatus == "loading" && m(_components.Loader, [m("h1.logo-font", "Loading Data")]), state.pageStatus == "error" && m(_components.Banner, [m("h1.logo-font", "Error Loading Data: ".concat(state.error))]), state.pageStatus == "success" && [m(_components.FeedNav, {
        fetchData: loadArticles,
        mdl,
        data
      }), state.feedStatus == "loading" && m("ion-text", "Loading Articles ..."), state.feedStatus == "success" && state.total ? [m(_components.Articles, {
        mdl,
        data
      }), m(_components.Paginator, {
        mdl,
        state,
        fetchDataFor: offset => {
          state.offset = offset;
          loadArticles(mdl);
        }
      })] : m("ion-text", "No articles are here... yet."), mdl.state.isLoggedIn() && m("ion-fab", {
        vertical: "bottom",
        horizontal: "end",
        slot: "fixed"
      }, m(m.route.Link, {
        class: "nav-link",
        href: "/editor"
      }, [m("ion-fab-button", m("ion-icon", {
        name: "add-circle"
      }))])), m("", m(_components.SideBar, {
        mdl,
        data
      }))]];
    }
  };
};

var _default = Home;
exports.default = _default;
});

;require.register("pages/login.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.loginTask = void 0;

var _Http = _interopRequireDefault(require("Http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loginTask = http => mdl => user => http.postTask(mdl)("users/login")({
  user
});

exports.loginTask = loginTask;

var Login = () => {
  var state = {
    errors: {},
    disabled: false
  };
  var data = {
    email: "",
    password: ""
  };

  var onSubmit = (mdl, e) => {
    e.preventDefault();
    state.disabled = true;

    var onSuccess = (_ref) => {
      var {
        user
      } = _ref;
      sessionStorage.setItem("token", "Token ".concat(user.token));
      sessionStorage.setItem("user", JSON.stringify(user));
      mdl.user = user;
      state.disabled = false;
      m.route.set("/home");
    };

    var onError = errors => {
      state.errors = errors;
      state.disabled = false;
      console.log(state.errors);
    };

    loginTask(_Http.default)(mdl)(data).fork(onError, onSuccess);
  };

  return {
    view: (_ref2) => {
      var {
        attrs: {
          mdl
        }
      } = _ref2;
      return m("div.auth-page", m("div.container.page", m("div.row", m("div.col-md-6.offset-md-3.col-xs-12", [m("h1.text-xs-center", "Login"), m("p.text-xs-center", m(m.route.Link, {
        href: "/register"
      }, "Need an account?"), state.errors["email or password"] && m(".error-messages", m("span", "email or password  ".concat(state.errors["email or password"])))), m("form", [m("fieldset.form-group", m("input.form-control.form-control-lg", {
        type: "text",
        disabled: state.disabled,
        placeholder: "email",
        onchange: e => data.email = e.target.value,
        value: data.email,
        onblur: e => state.isSubmitted && validate
      }), state.errors.email && m(".error-messages", m("span", state.errors.email))), m("fieldset.form-group", m("input.form-control.form-control-lg", {
        type: "password",
        disabled: state.disabled,
        placeholder: "password",
        onchange: e => data.password = e.target.value,
        value: data.password,
        onblur: e => state.isSubmitted && validate
      })), m("button.btn.btn-lg.btn-primary.pull-xs-right", {
        type: "submit",
        onclick: e => onSubmit(mdl, e)
      }, "Login")])]))));
    }
  };
};

var _default = Login;
exports.default = _default;
});

;require.register("pages/profile.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.loadInitDataTask = exports.loadDataTask = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

var _components = require("components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var followAuthorUrl = author => "profiles/".concat(author, "/follow");

var followAuthorTask = http => mdl => author => http.postTask(mdl)(followAuthorUrl(author))();

var unFollowAuthorTask = http => mdl => author => http.deleteTask(mdl)(followAuthorUrl(author));

var getProfileTask = http => mdl => username => http.getTask(mdl)("profiles/".concat(username));

var getAuthorArticlesTask = http => mdl => state => username => http.getTask(mdl)("articles?limit=".concat(state.limit, "&offset=").concat(state.offset, "&author=").concat(username));

var getAuthorFavoriteArticlesTask = http => mdl => state => username => http.getTask(mdl)("articles?limit=".concat(state.limit, "&offset=").concat(state.offset, "&favorited=").concat(username));

var loadDataTask = http => mdl => state => state.showFaveArticles ? getAuthorFavoriteArticlesTask(http)(mdl)(state)(mdl.slug) : getAuthorArticlesTask(http)(mdl)(state)(mdl.slug);

exports.loadDataTask = loadDataTask;

var loadInitDataTask = http => mdl => state => Task.of(profile => authorArticles => _objectSpread(_objectSpread({}, profile), {}, {
  authorArticles
})).ap(getProfileTask(http)(mdl)(mdl.slug)).ap(getAuthorArticlesTask(http)(mdl)(state)(mdl.slug));

exports.loadInitDataTask = loadInitDataTask;

var Profile = (_ref) => {
  var {
    attrs: {
      mdl
    }
  } = _ref;
  var data = {
    authorArticles: {
      articles: [],
      articlesCount: 0
    },
    authorFavoriteArticles: {
      articles: [],
      articlesCount: 0
    }
  };
  var state = {
    pageStatus: "loading",
    feedStatus: "loading",
    showFaveArticles: false,
    limit: 5,
    offset: 0,
    total: 0,
    error: null
  };

  var loadData = mdl => {
    var onSuccess = result => {
      state.showFaveArticles ? data.authorFavoriteArticles = result : data.authorArticles = result;
      state.total = state.showFaveArticles ? data.authorFavoriteArticles.articlesCount : data.authorArticles.articlesCount;
      state.feedStatus = "success";
    };

    var onError = error => {
      console.log("error", error);
      state.error = error;
      state.feedStatus = "error";
    };

    state.feedStatus = "loading";
    loadDataTask(_Http.default)(mdl)(state).fork(onError, onSuccess);
  };

  var loadInitData = mdl => {
    var onSuccess = (_ref2) => {
      var {
        authorArticles,
        profile
      } = _ref2;
      data.authorArticles = authorArticles;
      data.profile = profile;
      state.pageStatus = "success";
      state.feedStatus = "success";
      state.total = data.authorArticles.articlesCount;
    };

    var onError = error => {
      console.log("error", error);
      state.error = error;
      state.pageStatus = "error";
      m.route.set("/home");
    };

    state.pageStatus = "loading";
    loadInitDataTask(_Http.default)(mdl)(state).fork(onError, onSuccess);
  };

  var selectFeed = toShowFaveArticles => {
    state.showFaveArticles = toShowFaveArticles;
    state.offset = 0;
    loadData(mdl);
  };

  var toggleAuthorFollow = (_ref3) => {
    var {
      author: {
        username,
        following
      }
    } = _ref3;
    var onError = (0, _Utils.log)("toggleAuthorFollow, err-auth");

    var onSuccess = (_ref4) => {
      var {
        profile: {
          following
        }
      } = _ref4;
      return data.profile.following = following;
    };

    var toggleTask = following ? unFollowAuthorTask : followAuthorTask;
    toggleTask(_Http.default)(mdl)(username).fork(onError, onSuccess);
  };

  return {
    oninit: (_ref5) => {
      var {
        attrs: {
          mdl
        }
      } = _ref5;
      return loadInitData(mdl);
    },
    view: (_ref6) => {
      var {
        attrs: {
          mdl
        }
      } = _ref6;
      return m(".profile-page", state.pageStatus == "loading" && m(_components.Loader, [m("h1.logo-font", "Loading ...")]), state.pageStatus == "error" && m(_components.Banner, [m("h1.logo-font", "Error Loading Data: ".concat(state.error))]), state.pageStatus == "success" && [m(".user-info", m(".container", m(".row", m(".col-xs-12.col-md-10.offset-md-1", [m("img.user-img", {
        src: (0, _Utils.sanitizeImg)(data.profile.image)
      }), m("h4", data.profile.username), m("p", data.profile.bio), data.profile.username !== mdl.user.username ? m("button.btn.btn-sm.btn-outline-secondary.action-btn", {
        onclick: e => {
          toggleAuthorFollow({
            author: {
              username: data.profile.username,
              following: data.profile.following
            }
          });
        }
      }, [data.profile.following ? [m("i.ion-minus-round"), " Unfollow ".concat(data.profile.username, " ")] : [m("i.ion-plus-round"), " Follow ".concat(data.profile.username, " ")]]) : m("button.btn.btn-sm.btn-outline-secondary.action-btn", {
        onclick: e => m.route.set("/settings/".concat(data.profile.username))
      }, [m("i.ion-gear-a.p-5"), "Edit Profile Settings"])])))), m(".container", m(".row", m(".col-xs-12.col-md-10.offset-md-1", [m(".articles-toggle", m("ul.nav.nav-pills.outline-active", [m("li.nav-item", m("a.nav-link ".concat(!state.showFaveArticles && "active"), {
        onclick: e => selectFeed(false)
      }, "My Articles")), m("li.nav-item", m("a.nav-link ".concat(state.showFaveArticles && "active"), {
        onclick: e => selectFeed(true)
      }, "Favorited Articles"))])), state.feedStatus == "loading" && "Loading Articles...", state.feedStatus == "error" && m(_components.Banner, [m("h1.logo-font", "Error Loading Data: ".concat(state.error))]), state.feedStatus == "success" && [state.showFaveArticles ? m(_components.Articles, {
        mdl,
        data: data.authorFavoriteArticles
      }) : m(_components.Articles, {
        mdl,
        data: data.authorArticles
      }), m(_components.Paginator, {
        mdl,
        state,
        fetchDataFor: offset => {
          state.offset = offset;
          loadData(mdl);
        }
      })]])))]);
    }
  };
};

var _default = Profile;
exports.default = _default;
});

;require.register("pages/register.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registerTask = http => mdl => user => http.postTask(mdl)("users")({
  user
});

var Register = () => {
  var state = {
    errors: [],
    disabled: false
  };
  var data = {
    username: "",
    email: "",
    password: ""
  };

  var onSubmit = (mdl, e) => {
    e.preventDefault();
    console.log(mdl);
    state.disabled = true;

    var onSuccess = (_ref) => {
      var {
        user
      } = _ref;
      mdl.user = user;
      sessionStorage.setItem("token", "Token ".concat(user.token));
      sessionStorage.setItem("user", JSON.stringify(user));
      state.disabled = false;
      m.route.set("/home");
      console.log("success", user);
    };

    var onError = errors => {
      state.disabled = false;
      state.errors = (0, _Utils.errorViewModel)(errors);
    };

    state.isSubmitted = true;
    registerTask(_Http.default)(mdl)(data).fork(onError, onSuccess);
  };

  return {
    view: (_ref2) => {
      var {
        attrs: {
          mdl
        }
      } = _ref2;
      return m(".auth-page", m(".container.page", m(".row", m(".col-md-6.offset-md-3.col-xs-12", [m("h1.text-xs-center", "Sign Up"), m("p.text-xs-center", m(m.route.Link, {
        href: "/login"
      }, "Have an account?")), state.errors && state.errors.map(e => m(".error-messages", m("ul", "".concat(e.key), e.values.map(error => m("li", error))))), m("form", [m("fieldset.form-group", m("input.form-control.form-control-lg", {
        type: "text",
        disabled: state.disabled,
        placeholder: "Your Name",
        onchange: e => data.username = e.target.value,
        value: data.username
      })), m("fieldset.form-group", m("input.form-control.form-control-lg", {
        type: "text",
        disabled: state.disabled,
        placeholder: "email",
        onchange: e => data.email = e.target.value,
        value: data.email
      })), m("fieldset.form-group", m("input.form-control.form-control-lg", {
        type: "password",
        disabled: state.disabled,
        placeholder: "password",
        onchange: e => data.password = e.target.value,
        value: data.password
      })), m("button.btn.btn-lg.btn-primary.pull-xs-right", {
        type: "submit",
        onclick: e => onSubmit(mdl, e)
      }, "Sign Up")])]))));
    }
  };
};

var _default = Register;
exports.default = _default;
});

;require.register("pages/user.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logout = () => {
  sessionStorage.clear();
  m.route.set("/home");
};

var submitTask = http => mdl => data => http.putTask(mdl)("user")(data);

var User = (_ref) => {
  var {
    attrs: {
      mdl: {
        user: {
          image,
          username,
          password,
          bio,
          email
        }
      }
    }
  } = _ref;
  var data = {
    image,
    username,
    password,
    bio,
    email
  };

  var submit = (mdl, data) => {
    var onSuccess = (_ref2) => {
      var {
        user
      } = _ref2;
      sessionStorage.setItem("user", JSON.stringify(user));
      mdl.user = user;
      console.log(mdl.user);
      m.route.set("/home");
    };

    var onError = (0, _Utils.log)("error");
    submitTask(_Http.default)(mdl)(data).fork(onError, onSuccess);
  };

  return {
    view: (_ref3) => {
      var {
        attrs: {
          mdl
        }
      } = _ref3;
      return m(".settings-page", m(".container.page", m(".row", m(".col-md-6.offset-md-3.col-xs-12", [m("h1.text-xs-center", "Your Settings"), m("form", m("fieldset", [m("fieldset.form-group", m("input.form-control.form-control-lg", {
        type: "text",
        placeholder: "URL of profile picture",
        onchange: e => data.image = e.target.value,
        value: data.image
      })), m("fieldset.form-group", m("input.form-control.form-control-lg", {
        type: "text",
        placeholder: "Your Name",
        onchange: e => data.username = e.target.value,
        value: data.username
      })), m("fieldset.form-group", m("textarea.form-control.form-control-lg", {
        placeholder: "Short bio about you",
        onchange: e => data.bio = e.target.value,
        value: data.bio
      })), m("fieldset.form-group", m("fieldset.form-group", m("input.form-control.form-control-lg", {
        type: "text",
        placeholder: "Email",
        onchange: e => data.email = e.target.value,
        value: data.email
      }))), m("fieldset.form-group", m("fieldset.form-group", m("input.form-control.form-control-lg", {
        type: "password",
        placeholder: "Password",
        onchange: e => data.password = e.target.value,
        value: data.password
      }))), m("button.btn.btn-lg.btn-primary.pull-xs-right", {
        onclick: e => submit(mdl, data)
      }, " Update Settings "), m("button.btn.btn-outline-danger.pull-xs-right", {
        onclick: e => logout(mdl, data)
      }, "Or click here to logout.")]))]))));
    }
  };
};

var _default = User;
exports.default = _default;
});

;require.register("routes.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./layout/index"));

var _home = _interopRequireDefault(require("./pages/home"));

var _article = _interopRequireDefault(require("./pages/article"));

var _profile = _interopRequireDefault(require("./pages/profile"));

var _register = _interopRequireDefault(require("./pages/register"));

var _login = _interopRequireDefault(require("./pages/login"));

var _user = _interopRequireDefault(require("./pages/user"));

var _editor = _interopRequireDefault(require("./pages/editor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = mdl => {
  return {
    "/home": {
      onmatch: (_, b) => {
        mdl.slug = b;
      },
      render: () => m(_index.default, {
        mdl
      }, m(_home.default, {
        mdl
      }))
    },
    "/editor": {
      onmatch: (_, b) => {
        mdl.slug = b;
      },
      render: () => m(_index.default, {
        mdl
      }, m(_editor.default, {
        mdl,
        key: mdl.slug
      }))
    },
    "/editor/:slug": {
      onmatch: (_ref) => {
        var {
          slug
        } = _ref;
        mdl.slug = slug;
      },
      render: () => m(_index.default, {
        mdl
      }, m(_editor.default, {
        mdl
      }))
    },
    "/article/:slug": {
      onmatch: (_ref2) => {
        var {
          slug
        } = _ref2;
        mdl.slug = slug;
      },
      render: () => m(_index.default, {
        mdl
      }, m(_article.default, {
        mdl
      }))
    },
    "/profile/:slug": {
      onmatch: (_ref3) => {
        var {
          slug
        } = _ref3;
        mdl.slug = slug;
      },
      render: () => m(_index.default, {
        mdl
      }, m(_profile.default, {
        mdl,
        key: mdl.slug
      }))
    },
    "/settings/:slug": {
      onmatch: (_ref4) => {
        var {
          slug
        } = _ref4;
        mdl.slug = slug;
      },
      render: () => m(_index.default, {
        mdl
      }, m(_user.default, {
        mdl,
        key: mdl.slug
      }))
    },
    "/login": {
      onmatch: (_, b) => {
        mdl.slug = b;
      },
      render: () => m(_index.default, {
        mdl
      }, m(_login.default, {
        mdl
      }))
    },
    "/register": {
      onmatch: (_, b) => {
        mdl.slug = b;
      },
      render: () => m(_index.default, {
        mdl
      }, m(_register.default, {
        mdl
      }))
    }
  };
};

var _default = routes;
exports.default = _default;
});

;require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.m = require("mithril");
window.Task = require("data.task");


});})();require('___globals___');

require('initialize');
//# sourceMappingURL=app.js.map