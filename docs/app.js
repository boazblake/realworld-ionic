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
exports["default"] = exports.parseHttpSuccess = exports.parseHttpError = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var api = "https://conduit.productionready.io/api/";

var onProgress = function onProgress(mdl) {
  return function (e) {
    if (e.lengthComputable) {
      mdl.state.loadingProgress.max = e.total;
      mdl.state.loadingProgress.value = e.loaded;
      m.redraw();
    }
  };
};

function onLoad() {
  return false;
}

var onLoadStart = function onLoadStart(mdl) {
  return function (e) {
    mdl.state.isLoading = true;
    return false;
  };
};

var onLoadEnd = function onLoadEnd(mdl) {
  return function (e) {
    mdl.state.isLoading = false;
    mdl.state.loadingProgress.max = 0;
    mdl.state.loadingProgress.value = 0;
    return false;
  };
};

var xhrProgress = function xhrProgress(mdl) {
  return {
    config: function config(xhr) {
      xhr.onprogress = onProgress(mdl);
      xhr.onload = onLoad;
      xhr.onloadstart = onLoadStart(mdl);
      xhr.onloadend = onLoadEnd(mdl);
    }
  };
};

var parseHttpError = function parseHttpError(mdl) {
  return function (rej) {
    return function (e) {
      mdl.state.isLoading = false;
      return e.response ? rej(e.response.errors) : rej("Something went wrong.");
    };
  };
};

exports.parseHttpError = parseHttpError;

var parseHttpSuccess = function parseHttpSuccess(mdl) {
  return function (res) {
    return function (data) {
      mdl.state.isLoading = false;
      return res(data);
    };
  };
};

exports.parseHttpSuccess = parseHttpSuccess;

var getUserToken = function getUserToken() {
  return localStorage.getItem("token") ? {
    authorization: localStorage.getItem("token")
  } : "";
};

var call = function call(_headers) {
  return function (method) {
    return function (mdl) {
      return function (url) {
        return function (body) {
          if (["POST", "PUT", "DELETE"].includes(method) && !mdl.state.isLoggedIn()) {
            if (!["/login", "/register"].includes(mdl.slug)) {
              return Task.rejected(m.route.set("/register"));
            }
          }

          mdl.state.isLoading = true;
          return new Task(function (rej, res) {
            return m.request(_objectSpread({
              method: method,
              url: api + url,
              headers: _objectSpread({
                "content-type": "application/json"
              }, _headers),
              body: body,
              withCredentials: false
            }, xhrProgress(mdl))).then(parseHttpSuccess(mdl)(res), parseHttpError(mdl)(rej));
          });
        };
      };
    };
  };
};

var Http = {
  getTask: function getTask(mdl) {
    return function (url) {
      return call(getUserToken())("GET")(mdl)(url)(null);
    };
  },
  deleteTask: function deleteTask(mdl) {
    return function (url) {
      return call(getUserToken())("DELETE")(mdl)(url)(null);
    };
  },
  postTask: function postTask(mdl) {
    return function (url) {
      return function (data) {
        return call(getUserToken())("POST")(mdl)(url)(data);
      };
    };
  },
  putTask: function putTask(mdl) {
    return function (url) {
      return function (data) {
        return call(getUserToken())("PUT")(mdl)(url)(data);
      };
    };
  }
};
var _default = Http;
exports["default"] = _default;
});

;require.register("Utils.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorViewModel = exports.sanitizeImg = exports.log = void 0;

var log = function log(m) {
  return function (v) {
    console.log(m, v);
    return v;
  };
};

exports.log = log;

var secureImg = function secureImg(url) {
  return url.match(/(https)./) ? url : url.replace("http", "https");
};

var sanitizeImg = function sanitizeImg(url) {
  return url && url.match(/\.(jpeg|jpg|gif|png|svg)$/) ? secureImg(url) : "https://static.productionready.io/images/smiley-cyrus.jpg";
};

exports.sanitizeImg = sanitizeImg;

var errorViewModel = function errorViewModel(err) {
  return Object.keys(err).map(function (k) {
    return {
      key: k.toUpperCase(),
      errors: err[k]
    };
  });
};

exports.errorViewModel = errorViewModel;
});

;require.register("app.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var toRouter = function toRouter(mdl) {
  return function (Router, route) {
    var matcher = route.url.includes(":slug") ? function (_ref) {
      var slug = _ref.slug;
      mdl.slug = slug;
    } : function (_, b) {
      mdl.slug = b;
    };

    var renderer = function renderer() {
      return route.config.isAuth ? mdl.state.isLoggedIn() ? route.component(mdl) : m.route.set("/login") : route.component(mdl);
    };

    Router[route.url] = {
      onmatch: matcher,
      render: renderer
    };
    return Router;
  };
};

var App = function App(mdl) {
  return mdl.Routes.reduce(toRouter(mdl), {});
};

var _default = App;
exports["default"] = _default;
});

;require.register("components/articles.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Articles = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

var _dayjs = _interopRequireDefault(require("dayjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var favoriteArticleUrl = function favoriteArticleUrl(slug) {
  return "articles/".concat(slug, "/favorite");
};

var favoriteArticleTask = function favoriteArticleTask(http) {
  return function (mdl) {
    return function (slug) {
      return http.postTask(mdl)(favoriteArticleUrl(slug))();
    };
  };
};

var unFavoriteArticleTask = function unFavoriteArticleTask(http) {
  return function (mdl) {
    return function (slug) {
      return http.deleteTask(mdl)(favoriteArticleUrl(slug));
    };
  };
};

var ArticlePreview = function ArticlePreview(_ref) {
  var _ref$attrs = _ref.attrs,
      mdl = _ref$attrs.mdl,
      article = _ref$attrs.article;
  var data = article;

  var toggleArticleLike = function toggleArticleLike(favorited, slug) {
    var onError = (0, _Utils.log)("toggleArticleLike err-art");

    var onSuccess = function onSuccess(_ref2) {
      var _ref2$article = _ref2.article,
          favorited = _ref2$article.favorited,
          favoritesCount = _ref2$article.favoritesCount;
      data.favorited = favorited;
      data.favoritesCount = favoritesCount;
    };

    var toggle = favorited ? unFavoriteArticleTask : favoriteArticleTask;
    toggle(_Http["default"])(mdl)(slug).fork(onError, onSuccess);
  };

  return {
    view: function view() {
      return m("ion-item", {
        button: true
      }, m("ion-grid", [m("ion-row.ion-justify-content-between.ion-align-items-end", [m("ion-col", {
        size: 9
      }, m("ion-item", {
        lines: "none",
        onclick: function onclick() {
          return m.route.set("/profile/".concat(data.author.username), {
            replace: true
          });
        }
      }, m("ion-avatar", {
        slot: "start"
      }, m("img", {
        style: {
          transform: "scale(1.25)"
        },
        src: (0, _Utils.sanitizeImg)(data.author.image)
      })), m("ion-label", m("ion-text", m("h2", data.author.username)), m("p", (0, _dayjs["default"])().format("MM/DD/YYYY HH:mm", data.createdAt))))), m("ion-col", {
        size: 3
      }, m("ion-item", {
        lines: "none",
        onclick: function onclick(e) {
          return toggleArticleLike(data.favorited, data.slug);
        }
      }, m("ion-icon", {
        color: "danger",
        name: data.favorited ? "heart" : "heart-outline"
      }), m("ion-text", data.favoritesCount)))]), m("ion-row.ion-justify-content-between.ion-align-items-end", m("ion-col", m(m.route.Link, {
        "class": "preview-link",
        href: "/article/".concat(data.slug)
      }, m("ion-text", m("h1", data.title)), m("ion-text", m("p", data.description))))), m("ion-row", m("ion-col", m("ion-list", {
        side: "end"
      }, data.tagList.map(function (tag) {
        return m("ion-chip", tag);
      }))))]));
    }
  };
};

var Articles = function Articles() {
  return {
    view: function view(_ref3) {
      var _ref3$attrs = _ref3.attrs,
          mdl = _ref3$attrs.mdl,
          data = _ref3$attrs.data;
      return data.articles.length ? m("ion-list", {
        button: true
      }, data.articles.map(function (article) {
        return m(ArticlePreview, {
          mdl: mdl,
          data: data,
          article: article
        });
      })) : m("p", "No articles are here... yet.");
    }
  };
};

exports.Articles = Articles;
});

;require.register("components/card.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Card = void 0;
var Card = {
  view: function view(_ref) {
    var _ref$attrs = _ref.attrs,
        options = _ref$attrs.options,
        header = _ref$attrs.header,
        content = _ref$attrs.content,
        footer = _ref$attrs.footer;
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

var _dayjs = _interopRequireDefault(require("dayjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var trimBody = (0, _ramda.over)((0, _ramda.lensProp)("body"), _ramda.trim);

var formatComment = function formatComment(_ref) {
  var author = _ref.author,
      body = _ref.body,
      id = _ref.id,
      createdAt = _ref.createdAt;
  return {
    author: author,
    body: body,
    id: id,
    date: (0, _dayjs["default"])().format("MM/DD/YYYY HH:mm", createdAt)
  };
};

var getCommentsTask = function getCommentsTask(http) {
  return function (mdl) {
    return function (slug) {
      return http.getTask(mdl)("articles/".concat(slug, "/comments")).map((0, _ramda.prop)("comments")).map((0, _ramda.map)(formatComment));
    };
  };
};

var deleteCommentTask = function deleteCommentTask(http) {
  return function (mdl) {
    return function (slug) {
      return function (id) {
        return http.deleteTask(mdl)("articles/".concat(slug, "/comments/").concat(id));
      };
    };
  };
};

var submitTask = function submitTask(http) {
  return function (mdl) {
    return function (comment) {
      return http.postTask(mdl)("articles/".concat(mdl.slug, "/comments"))({
        comment: comment
      });
    };
  };
};

var CommentForm = function CommentForm(_ref2) {
  var _ref2$attrs = _ref2.attrs,
      mdl = _ref2$attrs.mdl,
      reload = _ref2$attrs.reload;
  var comment = {
    body: ""
  };
  var state = {
    errors: [],
    disabled: false
  };

  var onError = function onError(errors) {
    state.errors = (0, _Utils.errorViewModel)(errors);
    console.log("Error with form ", state);
    state.disabled = false;
  };

  var onSuccess = function onSuccess() {
    comment.body = "";
    state.errors = [];
    state.disabled = false;
    reload();
  };

  var submit = function submit(comment) {
    return submitTask(_Http["default"])(mdl)(trimBody(comment)).fork(onError, onSuccess);
  };

  return {
    oninit: function oninit() {
      return comment.body = "";
    },
    view: function view(_ref3) {
      var mdl = _ref3.attrs.mdl;
      return [m("ion-grid", m("ion-row.ion-justify-content-between.ion-align-items-end", m("ion-col", m("ion-textarea", {
        rows: 3,
        placeholder: "Write a comment ...",
        onchange: function onchange(e) {
          return comment.body = e.target.value;
        },
        disabled: state.disabled,
        value: comment.body
      }))), m("ion-row.ion-justify-content-between.ion-align-items-end", m("ion-col", m("ion-avatar", m("img", {
        src: (0, _Utils.sanitizeImg)(mdl.user.image)
      }))), m("ion-col", m("ion-button", {
        color: "light",
        onclick: function onclick(e) {
          state.disabled = true;
          submit(comment);
        }
      }, " Post Comment ")))), state.errors.map(function (e) {
        return e.values.map(function (err) {
          return m("p.error-messages", "".concat(e.key, " ").concat(err));
        });
      })];
    }
  };
};

var Comment = function Comment() {
  return {
    view: function view(_ref4) {
      var _ref4$attrs = _ref4.attrs,
          mdl = _ref4$attrs.mdl,
          _ref4$attrs$comment = _ref4$attrs.comment,
          _ref4$attrs$comment$a = _ref4$attrs$comment.author,
          image = _ref4$attrs$comment$a.image,
          username = _ref4$attrs$comment$a.username,
          body = _ref4$attrs$comment.body,
          date = _ref4$attrs$comment.date,
          id = _ref4$attrs$comment.id,
          deleteComment = _ref4$attrs.deleteComment;
      return m("ion-item", m("ion-grid", ("ion-row.ion-justify-content-between.ion-align-items-end", m("ion-text", body)), m("ion-row.ion-justify-content-between.ion-align-items-end", m(m.route.Link, {
        href: "/profile/".concat(username),
        "class": "comment-author m-5"
      }, m("ion-avatar", m("img", {
        src: (0, _Utils.sanitizeImg)(image)
      })), m("ion-text", username)), m("ion-text", date), username == mdl.user.username && m("ion-icon", {
        name: "trash-outline",
        onclick: function onclick(e) {
          return deleteComment(id);
        }
      }))));
    }
  };
};

var Comments = function Comments(_ref5) {
  var mdl = _ref5.attrs.mdl;
  var data = {
    comments: []
  };

  var loadComments = function loadComments(mdl) {
    var onSuccess = function onSuccess(comments) {
      return data.comments = comments;
    };

    var onError = (0, _Utils.log)("error with comments");
    getCommentsTask(_Http["default"])(mdl)(mdl.slug).fork(onError, onSuccess);
  };

  var _deleteComment = function deleteComment(id) {
    var onSuccess = function onSuccess(comments) {
      return data.comments = comments;
    };

    var onError = (0, _Utils.log)("error with comments");
    deleteCommentTask(_Http["default"])(mdl)(mdl.slug)(id).chain(function (x) {
      return getCommentsTask(_Http["default"])(mdl)(mdl.slug);
    }).fork(onError, onSuccess);
  };

  return {
    oninit: function oninit(_ref6) {
      var mdl = _ref6.attrs.mdl;
      return loadComments(mdl);
    },
    view: function view(_ref7) {
      var mdl = _ref7.attrs.mdl;
      return m("item-list", m(CommentForm, {
        mdl: mdl,
        reload: function reload() {
          return loadComments(mdl);
        }
      }), data.comments.map(function (c) {
        return m(Comment, {
          mdl: mdl,
          comment: c,
          deleteComment: function deleteComment(id) {
            return _deleteComment(id);
          }
        });
      }));
    }
  };
};

exports.Comments = Comments;
});

;require.register("components/component.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = void 0;

var Component = function Component() {
  return {
    view: function view() {
      return m("");
    }
  };
};

exports.Component = Component;
});

;require.register("components/dark-mode-toggle.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DarkModeToggle = void 0;

var DarkModeToggle = function DarkModeToggle() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("ion-item", mdl.state.darkmode && m("ion-label", m("ion-icon", {
        name: "sunny-outline"
      })), m("ion-toggle", {
        onclick: function onclick(e) {
          mdl.state.darkmode = !mdl.state.darkmode;
          document.body.classList.toggle("dark");
          window.matchMedia("(prefers-color-scheme: dark)");
        }
      }), !mdl.state.darkmode && m("ion-label", m("ion-icon", {
        name: "moon-outline"
      })));
    }
  };
};

exports.DarkModeToggle = DarkModeToggle;
});

;require.register("components/feed-nav.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeedNav = void 0;

var FeedNav = function FeedNav(_ref) {
  var fetchData = _ref.attrs.fetchData;
  return {
    view: function view(_ref2) {
      var _ref2$attrs = _ref2.attrs,
          mdl = _ref2$attrs.mdl,
          data = _ref2$attrs.data;
      return [m("ion-toolbar", m("ion-row", m("ion-col", m("ion-button", {
        fill: data.tags.current == "" && "solid",
        expand: "full",
        id: "",
        color: "light",
        onclick: function onclick(e) {
          data.tags.current = e.target.id;
          fetchData(mdl);
        }
      }, "Global Feed")), mdl.state.isLoggedIn() && m("ion-col", m("ion-button", {
        fill: data.tags.current == "feed" && "solid",
        expand: "full",
        id: "feed",
        color: "light",
        onclick: function onclick(e) {
          data.tags.current = e.target.id;
          fetchData(mdl);
        }
      }, "Your Feed"))), m("ion-row", m("ion-col", data.tags.selected.map(function (tag) {
        return m("ion-button", {
          fill: data.tags.current == tag && "solid",
          size: "small",
          color: "light",
          id: tag,
          onclick: function onclick(e) {
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
        );
      }))))];
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var deleteArticleUrl = function deleteArticleUrl(slug) {
  return "articles/".concat(slug);
};

var favoriteArticleUrl = function favoriteArticleUrl(slug) {
  return "articles/".concat(slug, "/favorite");
};

var followAuthorUrl = function followAuthorUrl(author) {
  return "profiles/".concat(author, "/follow");
};

var deleteArticleTask = function deleteArticleTask(http) {
  return function (mdl) {
    return http.deleteTask(mdl)(deleteArticleUrl(mdl.slug));
  };
};

var favoriteArticleTask = function favoriteArticleTask(http) {
  return function (mdl) {
    return http.postTask(mdl)(favoriteArticleUrl(mdl.slug))();
  };
};

var unFavoriteArticleTask = function unFavoriteArticleTask(http) {
  return function (mdl) {
    return http.deleteTask(mdl)(favoriteArticleUrl(mdl.slug));
  };
};

var followAuthorTask = function followAuthorTask(http) {
  return function (mdl) {
    return function (author) {
      return http.postTask(mdl)(followAuthorUrl(author))();
    };
  };
};

var unFollowAuthorTask = function unFollowAuthorTask(http) {
  return function (mdl) {
    return function (author) {
      return http.deleteTask(mdl)(followAuthorUrl(author));
    };
  };
};

var FollowFavorite = function FollowFavorite(_ref) {
  var _ref$attrs = _ref.attrs,
      mdl = _ref$attrs.mdl,
      data = _ref$attrs.data;

  var toggleArticleLike = function toggleArticleLike(_ref2) {
    var favorited = _ref2.favorited;
    var onError = (0, _Utils.log)("toggleArticleLike err-art");

    var onSuccess = function onSuccess(_ref3) {
      var _ref3$article = _ref3.article,
          favorited = _ref3$article.favorited,
          favoritesCount = _ref3$article.favoritesCount;
      data.favorited = favorited;
      data.favoritesCount = favoritesCount;
    };

    var toggle = favorited ? unFavoriteArticleTask : favoriteArticleTask;
    toggle(_Http["default"])(mdl).fork(onError, onSuccess);
  };

  var toggleAuthorFollow = function toggleAuthorFollow(_ref4) {
    var _ref4$author = _ref4.author,
        username = _ref4$author.username,
        following = _ref4$author.following;
    var onError = (0, _Utils.log)("toggleAuthorFollow, err-auth");

    var onSuccess = function onSuccess(_ref5) {
      var following = _ref5.profile.following;
      return data.author.following = following;
    };

    var toggle = following ? unFollowAuthorTask : followAuthorTask;
    toggle(_Http["default"])(mdl)(username).fork(onError, onSuccess);
  };

  var deleteArticle = function deleteArticle(slug) {
    var onError = (0, _Utils.log)("deleteArticle, err-auth");

    var onSuccess = function onSuccess(s) {
      console.log(s);
      m.route.set("/home");
    };

    deleteArticleTask(_Http["default"])(mdl).fork(onError, onSuccess);
  };

  return {
    view: function view(_ref6) {
      var _ref6$attrs = _ref6.attrs,
          mdl = _ref6$attrs.mdl,
          _ref6$attrs$data = _ref6$attrs.data,
          _ref6$attrs$data$auth = _ref6$attrs$data.author,
          username = _ref6$attrs$data$auth.username,
          image = _ref6$attrs$data$auth.image,
          following = _ref6$attrs$data$auth.following,
          favoritesCount = _ref6$attrs$data.favoritesCount,
          favorited = _ref6$attrs$data.favorited,
          slug = _ref6$attrs$data.slug;
      return m("ion-grid", m("ion-row", [mdl.user.username == username ? [m("ion-button", {
        color: "light",
        onclick: function onclick() {
          return m.route.set("/editor/".concat(slug));
        }
      }, m("ion-icon", {
        name: "person"
      }), m("ion-label", "Edit Article")), m("ion-button", {
        color: "danger",
        onclick: function onclick(e) {
          return deleteArticle(slug);
        }
      }, [m("ion-icon", {
        name: "trash-outline"
      }), m("ion-label", "Delete Article ")])] : [m("ion-col", {
        size: 5
      }, m(m.route.Link, {
        href: "profile/".concat(username)
      }, m("ion-item", {
        lines: "none"
      }, m("ion-avatar", m("ion-img", {
        src: (0, _Utils.sanitizeImg)(image)
      })), m("ion-text", username)))), m("ion-col", {
        size: 3
      }, m("ion-item", {
        lines: "none",
        onclick: function onclick(e) {
          return toggleArticleLike(data);
        }
      }, m("ion-icon", {
        color: "danger",
        name: favorited ? "heart" : "heart-outline"
      }), m("ion-label", favoritesCount))), m("ion-col", {
        size: 4
      }, m("ion-item", {
        lines: "none",
        onclick: function onclick(e) {
          return toggleAuthorFollow(data);
        }
      }, m("ion-icon", {
        name: following ? "people" : "people-outline"
      })))]]));
    }
  };
};

exports.FollowFavorite = FollowFavorite;
});

;require.register("components/form-errors.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormErrors = void 0;

var FormErrors = function FormErrors() {
  return {
    view: function view(_ref) {
      var errors = _ref.attrs.errors;
      return errors.map(function (_ref2) {
        var key = _ref2.key,
            errors = _ref2.errors;
        return m(".error-messages", m("ion-list", m("ion-label", {
          color: "danger"
        }, "".concat(key)), m("ion-list", errors.map(function (error) {
          return m("ion-item", {
            color: "danger"
          }, error);
        }))));
      });
    }
  };
};

exports.FormErrors = FormErrors;
});

;require.register("components/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
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

var _taglist = require("./taglist");

Object.keys(_taglist).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _taglist[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _taglist[key];
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

var _menu = require("./menu");

Object.keys(_menu).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _menu[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _menu[key];
    }
  });
});

var _sidebars = require("./sidebars");

Object.keys(_sidebars).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _sidebars[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _sidebars[key];
    }
  });
});

var _toaster = require("./toaster");

Object.keys(_toaster).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _toaster[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _toaster[key];
    }
  });
});

var _formErrors = require("./form-errors");

Object.keys(_formErrors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _formErrors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _formErrors[key];
    }
  });
});

var _profileLink = require("./profile-link");

Object.keys(_profileLink).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _profileLink[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _profileLink[key];
    }
  });
});

var _darkModeToggle = require("./dark-mode-toggle");

Object.keys(_darkModeToggle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _darkModeToggle[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _darkModeToggle[key];
    }
  });
});

var _component = require("./component");

Object.keys(_component).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _component[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _component[key];
    }
  });
});

var _skeletonText = require("./skeleton-text");

Object.keys(_skeletonText).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _skeletonText[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _skeletonText[key];
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

var Loader = function Loader() {
  return {
    view: function view(_ref) {
      var _ref$attrs = _ref.attrs,
          name = _ref$attrs.name,
          duration = _ref$attrs.duration;
      return m("ion-spinner.spinner", {
        duration: duration || 2000,
        name: name || "crescent"
      });
    }
  };
};

exports.Loader = Loader;
});

;require.register("components/menu.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Menu = exports.MenuToggle = void 0;

var _core = require("@ionic/core");

var MenuToggle = function MenuToggle(_ref) {
  var _ref$attrs = _ref.attrs,
      mdl = _ref$attrs.mdl,
      side = _ref$attrs.side,
      contents = _ref$attrs.contents,
      eHandler = _ref$attrs.eHandler,
      sHandler = _ref$attrs.sHandler;

  var toggleMenu = function toggleMenu() {
    _core.menuController.enable(true, side).then(_core.menuController.toggle(side)).then(function (x) {
      return console.log("?menutoggle s", x);
    }, function (z) {
      return console.log("menutoggle e", z);
    }); // .then(sHandler(mdl), eHandler(mdl))

  };

  return {
    view: function view() {
      return m("ion-menu-toggle", {
        onclick: function onclick() {
          return toggleMenu;
        }
      }, contents);
    }
  };
};

exports.MenuToggle = MenuToggle;

var Menu = function Menu() {
  return {
    view: function view(_ref2) {
      var _ref2$attrs = _ref2.attrs,
          mdl = _ref2$attrs.mdl,
          header = _ref2$attrs.header,
          title = _ref2$attrs.title,
          contentId = _ref2$attrs.contentId,
          contents = _ref2$attrs.contents;
      return m("ion-menu[type='push']", {
        onionWillOpen: function onionWillOpen(e) {
          mdl.menu.menuId = contentId; // console.log("onionWillOpen", e.target)
        },
        // onionDidOpen: (e) => {
        //   console.log("onionDidOpen", e)
        // },
        onionWillClose: function onionWillClose(e) {
          mdl.menu.menuId = null;
          console.log("onionwillClose", e);
        },
        // onionDidClose: (e) => {
        //   console.log("ionDidClose", e)
        // },
        contentId: contentId
      }, [header && header, title && m("ion-header", m("ion-toolbar", m("ion-title", title))), m("ion-content.has-header.has-subheader", contents)]);
    }
  };
};

exports.Menu = Menu;
});

;require.register("components/paginator.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Paginator = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Paginator = function Paginator() {
  return {
    view: function view(_ref) {
      var _ref$attrs = _ref.attrs,
          state = _ref$attrs.state,
          fetchDataFor = _ref$attrs.fetchDataFor;
      var total = Math.ceil(state.total / state.limit) + 1;
      var current = state.offset / state.limit + 1;

      var range = _toConsumableArray(Array(total).keys()).slice(1);

      return state.total > state.limit && range.map(function (page, idx) {
        return m("ion-chip", {
          color: page == current && "primary",
          onclick: function onclick(e) {
            return fetchDataFor(idx * state.limit);
          }
        }, page);
      });
    }
  };
};

exports.Paginator = Paginator;
});

;require.register("components/profile-link.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProfileLink = void 0;

var _Utils = require("Utils");

var _components = require("components");

var ProfileLink = function ProfileLink() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("", m(_components.MenuToggle, {
        side: "start",
        contents: m("ion-grid", {
          onclick: function onclick(e) {
            return m.route.set("/profile/".concat(mdl.user.username));
          }
        }, m("a", m("ion-row.ion-justify-content-evenly.ion-align-items-end", m("ion-avatar", m("ion-img", {
          src: (0, _Utils.sanitizeImg)(mdl.user.image)
        })), m("ion-text", m("h1", "".concat(mdl.user.username))))))
      }));
    }
  };
};

exports.ProfileLink = ProfileLink;
});

;require.register("components/sidebars.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SideBar = void 0;

var _menu = require("./menu");

var _components = require("components");

var _model = _interopRequireDefault(require("../model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var logout = function logout(mdl) {
  localStorage.clear();
  mdl = (0, _model["default"])();
  m.redraw();
  m.route.set("/home");
};

var SettingsMenu = function SettingsMenu() {
  return {
    view: function view(_ref) {
      var _ref$attrs = _ref.attrs,
          mdl = _ref$attrs.mdl,
          side = _ref$attrs.side;
      return m("ion-list", [m("ion-item", m(_components.MenuToggle, {
        mdl: mdl,
        side: "start",
        contents: m("ion-button", {
          color: "danger",
          onclick: function onclick() {
            return logout();
          }
        }, "logout")
      }), m(_components.MenuToggle, {
        mdl: mdl,
        side: "start",
        contents: m("ion-button", {
          color: "warning",
          onclick: function onclick(e) {
            return m.route.set("/settings/".concat(mdl.user.username));
          }
        }, m("ion-icon", {
          name: "settings"
        }), "Edit")
      }), m(_components.DarkModeToggle, {
        mdl: mdl
      })), m("ion-item", m(_components.TagList, {
        mdl: mdl
      }))]);
    }
  };
};

var SideBar = function SideBar() {
  return {
    view: function view(_ref2) {
      var mdl = _ref2.attrs.mdl;
      return m(_menu.Menu, {
        mdl: mdl,
        visibile: true,
        side: "start",
        menuId: "options",
        contentId: "layout",
        header: m("ion-header", m(_components.ProfileLink, {
          mdl: mdl
        })),
        contents: m(SettingsMenu, {
          mdl: mdl,
          side: "start"
        })
      });
    }
  };
}; // export const OptionsMenu = () => {
//   return {
//     view: ({ attrs: { mdl, side } }) =>
//       m("ion-list", [
//         m(
//           "ion-item",
//           m(
//             m.route.Link,
//             {
//               onclick: (e) =>
//                 menuController
//                   .close(side)
//                   .then(
//                     m.route.set(`/profile/${mdl.user.username}`),
//                     m.route.set(`/profile/${mdl.user.username}`)
//                   ),
//               // href: `/profile/${mdl.user.username}`,
//             },
//             mdl.user.username
//           )
//         ),
//       ]),
//   }
// }
// const test = (item) => {
//   menuController
//     .enable(item)
//     .then(menuController.isEnabled(item))
//     .then(
//       (s) => console.log("s", s),
//       (e) => console.log("e", e)
//     )
// }
// export const AuthMenu = () => {
//   return {
//     view: ({ attrs: { mdl, side } }) =>
//       m("ion-list", [
//         m("ion-item", m("ion-button", { onclick: test }, "test")),
//         m(
//           "ion-item",
//           m(
//             m.route.Link,
//             {
//               onclick: (e) => menuController.toggle(side),
//               href: "/register",
//             },
//             m("ion-label", "register")
//           )
//         ),
//         ,
//         m(
//           "ion-item",
//           m(
//             m.route.Link,
//             {
//               onclick: (e) => menuController.toggle(side),
//               href: "/login",
//             },
//             m("ion-label", "Login")
//           )
//         ),
//       ]),
//   }
// }
// export const StartSideBar = () => {
//   const side = "start"
//   return {
//     view: ({ attrs: { mdl } }) => {
//       console.log(side, mdl)
//       return mdl.state.isLoggedIn()
//         ? m(Menu, {
//             mdl,
//             side,
//             title: "Settings",
//             menuId: "settings",
//             contentId: "settings",
//             contents: m(SettingsMenu, { mdl, side }),
//           })
//         : m(Menu, {
//             mdl,
//             side,
//             title: "Login | Register",
//             menuId: "auth",
//             contentId: "auth",
//             contents: m(AuthMenu, { mdl, side }),
//           })
//     },
//   }
// }


exports.SideBar = SideBar;
});

;require.register("components/skeleton-text.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkeletonText = void 0;
var SkeletonItem = {
  view: function view() {
    return m("ion-item", [m("ion-thumbnail", {
      slot: "start"
    }, m("ion-skeleton-text", {
      animated: ""
    })), m("ion-label", [m("h3", m("ion-skeleton-text", {
      animated: "",
      style: {
        width: "50%"
      }
    })), m("p", m("ion-skeleton-text", {
      animated: "",
      style: {
        width: "80%"
      }
    })), m("p", m("ion-skeleton-text", {
      animated: "",
      style: {
        width: "60%"
      }
    }))])]);
  }
};

var SkeletonText = function SkeletonText() {
  return {
    view: function view() {
      return m("", {
        id: "skeleton"
      }, [m("ion-list", [m(SkeletonItem), m(SkeletonItem), m(SkeletonItem), m(SkeletonItem), m(SkeletonItem), m(SkeletonItem), m(SkeletonItem), m(SkeletonItem)])]);
    }
  };
};

exports.SkeletonText = SkeletonText;
});

;require.register("components/taglist.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagList = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getTagsTask = function getTagsTask(http) {
  return function (mdl) {
    return http.getTask(mdl)("tags");
  };
};

var TagList = function TagList(_ref) {
  var mdl = _ref.attrs.mdl;

  var selectTag = function selectTag(data, tag) {
    return mdl.data.tags.selected = (0, _ramda.uniq)(mdl.data.tags.selected.concat([tag]));
  };

  var onError = function onError(e) {};

  var onSuccess = function onSuccess(_ref2) {
    var tags = _ref2.tags;
    mdl.data.tags.tagList = tags;
  };

  getTagsTask(_Http["default"])(mdl).fork(onError, onSuccess);
  return {
    view: function view(_ref3) {
      var data = _ref3.attrs.data;

      var isSelected = function isSelected(tag) {
        return mdl.data.tags.selected.includes(tag) ? "primary" : "secondary";
      };

      return [m("ion-text", "Popular Tags"), m("ion-list", mdl.data.tags.tagList.filter(function (tag) {
        return !mdl.data.tags.selected.includes(tag);
      }).map(function (tag) {
        return m("ion-chip", {
          color: isSelected(tag),
          onclick: function onclick(e) {
            return selectTag(data, tag);
          }
        }, tag);
      }))];
    }
  };
};

exports.TagList = TagList;
});

;require.register("components/toaster.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toaster = void 0;

var _core = require("@ionic/core");

var Toaster = function Toaster() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("ion-toast", {
        oncreate: function oncreate(_ref2) {
          var dom = _ref2.dom;

          _core.toastController.create({
            component: dom,
            message: mdl.toast.msg,
            duration: mdl.toast.duration || 2000,
            showCloseButton: true,
            animated: true,
            color: mdl.toast.status
          }).then(function (toast) {
            return toast.present();
          });
        },
        onremove: function onremove() {
          return localStorage.removeItem("toaster");
        }
      });
    }
  };
};

exports.Toaster = Toaster;
});

;require.register("index.js", function(exports, require, module) {
"use strict";

var _app = _interopRequireDefault(require("./app.js"));

var _model = _interopRequireDefault(require("./model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var root = document.body;
var winW = window.innerWidth;

if (module.hot) {
  module.hot.accept();
}

if ('development' !== "production") {
  console.log("Looks like we are in development mode!");
} else {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./service-worker.js").then(function (registration) {
        console.log("⚙️ SW registered: ", registration);
      })["catch"](function (registrationError) {
        console.log("🧟 SW registration failed: ", registrationError);
      });
    });
  }
} // set display profiles


var getProfile = function getProfile(w) {
  if (w < 668) return "phone";
  if (w < 920) return "tablet";
  return "desktop";
};

var model = (0, _model["default"])();

var checkWidth = function checkWidth(winW) {
  var w = window.innerWidth;

  if (winW !== w) {
    winW = w;
    var lastProfile = model.settings.profile;
    model.settings.profile = getProfile(w);
    if (lastProfile != model.settings.profile) m.redraw();
  }

  return requestAnimationFrame(checkWidth);
};

model.settings.profile = getProfile(winW);
checkWidth(winW);

if (localStorage.getItem("user")) {
  model.user = JSON.parse(localStorage.getItem("user"));
}

m.route(root, "/home", (0, _app["default"])(model));
});

;require.register("initialize.js", function(exports, require, module) {
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  require("./index.js");
});
});

;require.register("layout/footer.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Footer = function Footer() {
  return {
    view: function view() {
      return m("ion-footer");
    }
  };
};

var _default = Footer;
exports["default"] = _default;
});

;require.register("layout/header.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _components = require("components");

var Header = function Header() {
  return {
    view: function view(_ref) {
      var mdl = _ref.attrs.mdl;
      return m("ion-header", !mdl.menu.menuId && m("ion-toolbar", mdl.state.isLoggedIn() ? [m.route.get() !== "/home" && m("ion-back-button", {
        slot: "start",
        onclick: function onclick(e) {
          e.preventDefault();
          history.back();
        },
        defaultHref: "/"
      }), m("ion-toolbar-container", m("ion-title", {
        href: "#",
        slot: "toolbar-content"
      }, m(m.route.Link, "RealWorld-Ionic-Mithril"))), m("ion-buttons", {
        slot: "end"
      }, m(_components.MenuToggle, {
        side: "start",
        mdl: mdl,
        eHandler: function eHandler() {
          return "";
        },
        sHandler: function sHandler() {
          return "";
        },
        contents: m("ion-button", m("ion-icon", {
          name: "options"
        }))
      }))] : m("ion-item", {
        slot: "primary",
        onclick: function onclick(e) {
          return m.route.set("/home");
        }
      }, [m("ion-text", m("h1", "conduit")), m("ion-text", m("p", "A place to share your knowledge."))])));
    }
  };
};

var _default = Header;
exports["default"] = _default;
});

;require.register("layout/index.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _header = _interopRequireDefault(require("./header.js"));

var _components = require("components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Layout = function Layout() {
  return {
    view: function view(_ref) {
      var children = _ref.children,
          mdl = _ref.attrs.mdl;
      return m("ion-app", m(_header["default"], {
        mdl: mdl
      }), mdl.state.isLoggedIn() && m(_components.SideBar, {
        mdl: mdl
      }), m("ion-content", {
        id: "layout",
        contentId: "layout"
      }, children), mdl.state.isToaster() && m(_components.Toaster, {
        mdl: mdl
      }));
    }
  };
};

var _default = Layout;
exports["default"] = _default;
});

;require.register("model.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sanitizer = new Sanitizer();

var BaseModel = function BaseModel() {
  return {
    menus: ["settings", "options"],
    menu: {
      title: "",
      side: "",
      menuId: null,
      contentId: "",
      contents: null
    },
    Routes: _routes["default"],
    state: {
      darkmode: false,
      isLoading: false,
      loadingProgress: {
        max: 0,
        value: 0
      },
      isLoggedIn: function isLoggedIn() {
        return !!localStorage.getItem("token");
      },
      isToaster: function isToaster() {
        return !!localStorage.getItem("toaster");
      }
    },
    settings: {},
    page: "",
    user: {},
    toast: {
      show: false,
      duration: 2000,
      status: null,
      msg: null
    },
    data: {
      tags: {
        tagList: [],
        selected: [],
        current: ""
      },
      articles: {}
    },
    sanitizer: sanitizer
  };
};

var _default = BaseModel;
exports["default"] = _default;
});

;require.register("pages/article.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _components = require("components");

var _marked = _interopRequireDefault(require("marked"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getArticleTask = function getArticleTask(http) {
  return function (mdl) {
    return function (slug) {
      return http.getTask(mdl)("articles/".concat(slug));
    };
  };
};

var Article = function Article() {
  var data = {};
  var state = {
    status: "loading",
    error: null
  };

  var onSuccess = function onSuccess(_ref) {
    var article = _ref.article,
        comments = _ref.comments;
    data.article = article;
    data.comments = comments;
    state.status = "success";
  };

  var onError = function onError(error) {
    console.log("error", error);
    state.error = error;
    state.status = "error";
  };

  var loadData = function loadData(mdl) {
    state.status = "loading";
    getArticleTask(_Http["default"])(mdl)(mdl.slug).fork(onError, onSuccess);
  };

  return {
    oninit: function oninit(_ref2) {
      var mdl = _ref2.attrs.mdl;
      return loadData(mdl);
    },
    view: function view(_ref3) {
      var mdl = _ref3.attrs.mdl;
      return [state.status == "loading" && m(_components.Loader, m("ion-text", m("h1", "Loading ..."))), state.status == "error" && m("ion-text", {
        color: "danger"
      }, m("h1", "Error Loading Data: ".concat(state.error))), state.status == "success" && [m("ion-text", m("h1", data.article.title)), m("ion-text", m.trust(mdl.sanitizer.sanitize((0, _marked["default"])(data.article.body)))), data.article.tagList.map(function (tag) {
        return m("ion-chip", tag);
      }), m(_components.FollowFavorite, {
        mdl: mdl,
        data: data.article
      }), m(_components.Comments, {
        mdl: mdl,
        comments: data.comments,
        reloadArticle: function reloadArticle() {
          return loadData(mdl);
        }
      })]];
    }
  };
};

var _default = Article;
exports["default"] = _default;
});

;require.register("pages/editor.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.submitArticleTask = exports.loadArticleTask = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

var _components = require("components");

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var loadArticleTask = function loadArticleTask(http) {
  return function (mdl) {
    return function (slug) {
      return http.getTask(mdl)("articles/".concat(slug)).map(formatTagsToString);
    };
  };
};

exports.loadArticleTask = loadArticleTask;
var formatTagsToList = (0, _ramda.over)((0, _ramda.lensProp)("tagList"), (0, _ramda.compose)(_ramda.uniq, (0, _ramda.split)(","), _ramda.trim));
var formatTagsToString = (0, _ramda.over)((0, _ramda.lensPath)(["article", "tagList"]), (0, _ramda.join)(","));

var submitArticleTask = function submitArticleTask(http) {
  return function (mdl) {
    return function (article) {
      return function (isEditing) {
        return isEditing ? http.putTask(mdl)("articles/".concat(mdl.slug))({
          article: article
        }) : http.postTask(mdl)("articles")({
          article: article
        });
      };
    };
  };
};

exports.submitArticleTask = submitArticleTask;

var Editor = function Editor(_ref) {
  var mdl = _ref.attrs.mdl;
  var data = {
    description: "",
    title: "",
    body: "",
    tagList: ""
  };
  var state = {
    isEditing: false,
    disabled: false,
    errors: null,
    status: "loading"
  };

  var initEditor = function initEditor(mdl) {
    state.disabled = false;

    var onSuccess = function onSuccess(_ref2) {
      var article = _ref2.article;
      console.log("?");
      data = article;
      state.status = "success";
    };

    var onError = function onError(errors) {
      state.errors = (0, _Utils.errorViewModel)(errors);
    };

    if (mdl.slug !== "/editor") {
      state.isEditing = true;
      loadArticleTask(_Http["default"])(mdl)(mdl.slug).fork(onError, onSuccess);
    } else {
      state.status = "success";
    }
  };

  var submitData = function submitData(data) {
    (0, _Utils.log)("data")([data, formatTagsToList(data)]);
    state.disabled = true;

    var onSuccess = function onSuccess(_ref3) {
      var slug = _ref3.article.slug;
      return m.route.set("/article/".concat(slug));
    };

    var onError = function onError(errors) {
      state.errors = (0, _Utils.errorViewModel)(errors);
      state.disabled = false;
    };

    submitArticleTask(_Http["default"])(mdl)(formatTagsToList(data))(state.isEditing).fork(onError, onSuccess);
  };

  return {
    oninit: function oninit(_ref4) {
      var mdl = _ref4.attrs.mdl;
      return initEditor(mdl);
    },
    view: function view() {
      return m("form", state.status == "loading" && m(_components.Loader, {
        mdl: mdl
      }), state.status == "error" && "Error!", state.status == "success" && [state.errors && m(_components.FormErrors, {
        mdl: mdl,
        errors: state.errors
      }), m("ion-item", m("ion-label", {
        position: "stacked"
      }, "Article Title"), m("ion-input", {
        type: "text",
        disabled: state.disabled,
        // placeholder: "Article Title",
        onchange: function onchange(e) {
          return data.title = e.target.value;
        },
        value: data.title
      })), m("ion-item", m("ion-label", {
        position: "stacked"
      }, "What's this article about?"), m("ion-input", {
        type: "text",
        disabled: state.disabled,
        // placeholder: "What's this article about?",
        onchange: function onchange(e) {
          return data.description = e.target.value;
        },
        value: data.description
      })), m("ion-item", m("ion-label", {
        position: "stacked"
      }, "Write your article (in markdown)"), m("ion-textarea", {
        rows: 8,
        // placeholder: "Write your article (in markdown)",
        disabled: state.disabled,
        onchange: function onchange(e) {
          return data.body = e.target.value;
        },
        value: data.body
      })), m("ion-item", m("ion-label", {
        position: "stacked"
      }, "Enter tags"), m("ion-input", {
        type: "text",
        disabled: state.disabled,
        // placeholder: "Enter tags",
        onchange: function onchange(e) {
          return data.tagList = e.target.value;
        },
        value: data.tagList
      })), m("ion-button", {
        color: "light",
        onclick: function onclick(e) {
          return submitData(data);
        }
      }, "Publish Article")]);
    }
  };
};

var _default = Editor;
exports["default"] = _default;
});

;require.register("pages/home.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _components = require("components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getArticlesTask = function getArticlesTask(http) {
  return function (mdl) {
    return function (state) {
      return function (data) {
        return data.tags.current == "feed" ? http.getTask(mdl)("articles/feed?limit=20&offset=".concat(state.offset)) : http.getTask(mdl)("articles?limit=20&offset=".concat(state.offset, "&tag=").concat(data.tags.current));
      };
    };
  };
};

var Home = function Home() {
  var state = {
    feedStatus: "loading",
    pageStatus: "loading",
    limit: 20,
    offset: 0,
    total: 0,
    error: null
  };

  var loadInitData = function loadInitData(mdl) {
    var onSuccess = function onSuccess(_ref) {
      var articles = _ref.articles,
          articlesCount = _ref.articlesCount;
      mdl.data.articles = articles;
      state.total = articlesCount;
      state.pageStatus = "success";
      state.feedStatus = "success";
    };

    var onError = function onError(error) {
      console.log("error", error);
      state.error = error;
      state.pageStatus = "error";
      localStorage.setItem("toaster", true);
      mdl.toast = {
        show: true,
        duration: 2000,
        status: "danger",
        msg: error
      };
    };

    state.pageStatus = "loading";
    getArticlesTask(_Http["default"])(mdl)(state)(mdl.data).fork(onError, onSuccess);
  };

  var loadArticles = function loadArticles(mdl) {
    var onSuccess = function onSuccess(_ref2) {
      var articles = _ref2.articles,
          articlesCount = _ref2.articlesCount;
      mdl.data.articles = articles;
      state.total = articlesCount;
      state.feedStatus = "success";
    };

    var onError = function onError(error) {
      console.log("error", error);
      state.error = error;
      state.feedStatus = "error";
      localStorage.setItem("toaster", true);
      mdl.toast = {
        show: true,
        duration: 2000,
        status: "danger",
        msg: error
      };
    };

    state.feedStatus = "loading";
    getArticlesTask(_Http["default"])(mdl)(state)(mdl.data).fork(onError, onSuccess);
  };

  return {
    oninit: function oninit(_ref3) {
      var mdl = _ref3.attrs.mdl;
      return loadInitData(mdl);
    },
    view: function view(_ref4) {
      var mdl = _ref4.attrs.mdl;
      return m("ion-content", {
        scroll: false,
        id: "profile",
        contentId: "profile"
      }, state.pageStatus == "success" && [m("ion-list-header", // { slot: "fixed" },
      m(_components.FeedNav, {
        fetchData: loadArticles,
        mdl: mdl,
        data: mdl.data
      })), state.feedStatus == "success" && state.total && [m(_components.Articles, {
        mdl: mdl,
        data: mdl.data
      }), m(_components.Paginator, {
        mdl: mdl,
        state: state,
        fetchDataFor: function fetchDataFor(offset) {
          state.offset = offset;
          loadArticles(mdl);
        }
      })], state.feedStatus == "success" && !state.total && m("ion-text", "No articles are here... yet."), mdl.state.isLoggedIn() && m("ion-fab", {
        style: {
          padding: "0 50px 40px 0"
        },
        vertical: "bottom",
        horizontal: "end",
        slot: "fixed"
      }, m(m.route.Link, {
        "class": "nav-link",
        href: "/editor"
      }, [m("ion-fab-button", m("ion-icon", {
        name: "add-circle"
      }))]))], !mdl.state.isLoggedIn() && state.pageStatus == "loading" || state.feedStatus == "loading" && m(_components.SkeletonText, [m("h1.logo-font", "Loading Data")]), state.pageStatus == "error" && m("ion-text", {
        color: "danger"
      }, m("h1", "Error Loading Data: ".concat(state.error))));
    }
  };
};

var _default = Home;
exports["default"] = _default;
});

;require.register("pages/login.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.loginTask = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

var _components = require("components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var loginTask = function loginTask(http) {
  return function (mdl) {
    return function (user) {
      return http.postTask(mdl)("users/login")({
        user: user
      });
    };
  };
};

exports.loginTask = loginTask;

var Login = function Login() {
  var state = {
    errors: null,
    disabled: false
  };
  var data = {
    email: "",
    password: ""
  };

  var onSubmit = function onSubmit(mdl, e) {
    e.preventDefault();
    state.disabled = true;

    var onSuccess = function onSuccess(_ref) {
      var user = _ref.user;
      localStorage.setItem("token", "Token ".concat(user.token));
      localStorage.setItem("user", JSON.stringify(user));
      mdl.user = user;
      state.disabled = false;
      m.route.set("/home");
    };

    var onError = function onError(errors) {
      state.disabled = false;
      state.errors = (0, _Utils.errorViewModel)(errors);
    };

    loginTask(_Http["default"])(mdl)(data).fork(onError, onSuccess);
  };

  return {
    view: function view(_ref2) {
      var mdl = _ref2.attrs.mdl;
      return m("form", [m("ion-text", m("h1", "Login")), state.errors && m(_components.FormErrors, {
        mdl: mdl,
        errors: state.errors
      }), m("ion-input", {
        type: "text",
        disabled: state.disabled,
        placeholder: "email",
        onchange: function onchange(e) {
          return data.email = e.target.value;
        },
        value: data.email,
        onblur: function onblur(e) {
          return state.isSubmitted && validate;
        }
      }), m("ion-input", {
        type: "password",
        disabled: state.disabled,
        placeholder: "password",
        onchange: function onchange(e) {
          return data.password = e.target.value;
        },
        value: data.password,
        onblur: function onblur(e) {
          return state.isSubmitted && validate;
        }
      }), m("ion-button", {
        color: "light",
        onclick: function onclick(e) {
          return onSubmit(mdl, e);
        }
      }, "Login"), m("ion-link", m(m.route.Link, {
        href: "/register"
      }, m("ion-label", "Need an Account?")))]);
    }
  };
};

var _default = Login;
exports["default"] = _default;
});

;require.register("pages/profile.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.loadInitDataTask = exports.loadDataTask = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

var _components = require("components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var followAuthorUrl = function followAuthorUrl(author) {
  return "profiles/".concat(author, "/follow");
};

var followAuthorTask = function followAuthorTask(http) {
  return function (mdl) {
    return function (author) {
      return http.postTask(mdl)(followAuthorUrl(author))();
    };
  };
};

var unFollowAuthorTask = function unFollowAuthorTask(http) {
  return function (mdl) {
    return function (author) {
      return http.deleteTask(mdl)(followAuthorUrl(author));
    };
  };
};

var getProfileTask = function getProfileTask(http) {
  return function (mdl) {
    return function (username) {
      return http.getTask(mdl)("profiles/".concat(username));
    };
  };
};

var getAuthorArticlesTask = function getAuthorArticlesTask(http) {
  return function (mdl) {
    return function (state) {
      return function (username) {
        return http.getTask(mdl)("articles?limit=".concat(state.limit, "&offset=").concat(state.offset, "&author=").concat(username));
      };
    };
  };
};

var getAuthorFavoriteArticlesTask = function getAuthorFavoriteArticlesTask(http) {
  return function (mdl) {
    return function (state) {
      return function (username) {
        return http.getTask(mdl)("articles?limit=".concat(state.limit, "&offset=").concat(state.offset, "&favorited=").concat(username));
      };
    };
  };
};

var loadDataTask = function loadDataTask(http) {
  return function (mdl) {
    return function (state) {
      return state.showFaveArticles ? getAuthorFavoriteArticlesTask(http)(mdl)(state)(mdl.slug) : getAuthorArticlesTask(http)(mdl)(state)(mdl.slug);
    };
  };
};

exports.loadDataTask = loadDataTask;

var loadInitDataTask = function loadInitDataTask(http) {
  return function (mdl) {
    return function (state) {
      return Task.of(function (profile) {
        return function (authorArticles) {
          return _objectSpread(_objectSpread({}, profile), {}, {
            authorArticles: authorArticles
          });
        };
      }).ap(getProfileTask(http)(mdl)(mdl.slug)).ap(getAuthorArticlesTask(http)(mdl)(state)(mdl.slug));
    };
  };
};

exports.loadInitDataTask = loadInitDataTask;

var Profile = function Profile(_ref) {
  var mdl = _ref.attrs.mdl;
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

  var loadData = function loadData(mdl) {
    var onSuccess = function onSuccess(result) {
      state.showFaveArticles ? data.authorFavoriteArticles = result : data.authorArticles = result;
      state.total = state.showFaveArticles ? data.authorFavoriteArticles.articlesCount : data.authorArticles.articlesCount;
      state.feedStatus = "success";
      console.log(state, data);
    };

    var onError = function onError(error) {
      console.log("error", error);
      state.error = error;
      state.feedStatus = "error";
      localStorage.setItem("toaster", true);
      mdl.toast = {
        show: true,
        duration: 2000,
        status: "danger",
        msg: error
      };
    };

    state.feedStatus = "loading";
    loadDataTask(_Http["default"])(mdl)(state).fork(onError, onSuccess);
  };

  var loadInitData = function loadInitData(mdl) {
    var onSuccess = function onSuccess(_ref2) {
      var authorArticles = _ref2.authorArticles,
          profile = _ref2.profile;
      data.authorArticles = authorArticles;
      data.profile = profile;
      state.pageStatus = "success";
      state.feedStatus = "success";
      state.total = data.authorArticles.articlesCount;
    };

    var onError = function onError(error) {
      console.log("error", error);
      state.error = error;
      state.pageStatus = "error";
      localStorage.setItem("toaster", true);
      mdl.toast = {
        show: true,
        duration: 2000,
        status: "danger",
        msg: error
      };
      m.route.set("/home");
    };

    state.pageStatus = "loading";
    loadInitDataTask(_Http["default"])(mdl)(state).fork(onError, onSuccess);
  };

  var selectFeed = function selectFeed(toShowFaveArticles) {
    state.showFaveArticles = toShowFaveArticles;
    state.offset = 0;
    loadData(mdl);
  };

  var toggleAuthorFollow = function toggleAuthorFollow(_ref3) {
    var _ref3$author = _ref3.author,
        username = _ref3$author.username,
        following = _ref3$author.following;
    var onError = (0, _Utils.log)("toggleAuthorFollow, err-auth");

    var onSuccess = function onSuccess(_ref4) {
      var following = _ref4.profile.following;
      return data.profile.following = following;
    };

    var toggleTask = following ? unFollowAuthorTask : followAuthorTask;
    toggleTask(_Http["default"])(mdl)(username).fork(onError, onSuccess);
  };

  return {
    oninit: function oninit(_ref5) {
      var mdl = _ref5.attrs.mdl;
      return loadInitData(mdl);
    },
    view: function view(_ref6) {
      var mdl = _ref6.attrs.mdl;
      return [state.pageStatus == "loading" && m(_components.Loader, m("h1.logo-font", "Loading ...")), state.pageStatus == "error" && m("ion-text", m("h1", "Error Loading Data: ".concat(state.error))), state.pageStatus == "success" && [m("ion-list-header", m("ion-row", m("ion-col", m("ion-img", {
        src: (0, _Utils.sanitizeImg)(data.profile.image)
      }), m("ion-text", m("h4", data.profile.username)), m("ion-text", m("p", data.profile.bio)), data.profile.username !== mdl.user.username ? m("ion-item", {
        lines: "none"
      }, m("ion-icon", {
        onclick: function onclick(e) {
          return toggleAuthorFollow({
            author: {
              username: data.profile.username,
              following: data.profile.following
            }
          });
        },
        name: data.profile.following ? "people" : "people-outline"
      })) : m("ion-chip", {
        onclick: function onclick(e) {
          return m.route.set("/settings/".concat(data.profile.username));
        }
      }, m("ion-icon", {
        name: "settings"
      }), m("ion-label", "Edit Profile Settings"))))), m("ion-buttons", m("ion-button", {
        fill: !state.showFaveArticles && "solid",
        color: "light",
        onclick: function onclick(e) {
          return selectFeed(false);
        }
      }, m("ion-link", "Written Articles")), m("ion-button", {
        fill: state.showFaveArticles && "solid",
        color: "light",
        onclick: function onclick(e) {
          return selectFeed(true);
        }
      }, m("ion-link", "Favorited Articles"))), state.feedStatus == "loading" && "Loading Articles...", state.feedStatus == "error" && m("ion-text", {
        color: "warning"
      }, [m("h1", "Error Loading Data: ".concat(state.error))]), state.feedStatus == "success" && m("ion-grid", [state.showFaveArticles ? m(_components.Articles, {
        mdl: mdl,
        data: data.authorFavoriteArticles
      }) : m(_components.Articles, {
        mdl: mdl,
        data: data.authorArticles
      }), m(_components.Paginator, {
        mdl: mdl,
        state: state,
        fetchDataFor: function fetchDataFor(offset) {
          state.offset = offset;
          loadData(mdl);
        }
      })])]];
    }
  };
};

var _default = Profile;
exports["default"] = _default;
});

;require.register("pages/register.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

var _components = require("components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var registerTask = function registerTask(http) {
  return function (mdl) {
    return function (user) {
      return http.postTask(mdl)("users")({
        user: user
      });
    };
  };
};

var Register = function Register() {
  var state = {
    errors: null,
    disabled: false
  };
  var data = {
    username: "",
    email: "",
    password: ""
  };

  var onSubmit = function onSubmit(mdl, e) {
    e.preventDefault();
    console.log(mdl);
    state.disabled = true;

    var onSuccess = function onSuccess(_ref) {
      var user = _ref.user;
      mdl.user = user;
      localStorage.setItem("token", "Token ".concat(user.token));
      localStorage.setItem("user", JSON.stringify(user));
      state.disabled = false;
      m.route.set("/home");
      console.log("success", user);
    };

    var onError = function onError(errors) {
      state.disabled = false;
      state.errors = (0, _Utils.errorViewModel)(errors);
    };

    state.isSubmitted = true;
    registerTask(_Http["default"])(mdl)(data).fork(onError, onSuccess);
  };

  return {
    view: function view(_ref2) {
      var mdl = _ref2.attrs.mdl;
      return m("form", [m("ion-text", m("h1", "Sign Up")), state.errors && m(_components.FormErrors, {
        mdl: mdl,
        errors: state.errors
      }), m("ion-input", {
        type: "text",
        disabled: state.disabled,
        placeholder: "Your Name",
        onchange: function onchange(e) {
          return data.username = e.target.value;
        },
        value: data.username
      }), m("ion-input", {
        type: "text",
        disabled: state.disabled,
        placeholder: "email",
        onchange: function onchange(e) {
          return data.email = e.target.value;
        },
        value: data.email
      }), m("ion-input", {
        type: "password",
        disabled: state.disabled,
        placeholder: "password",
        onchange: function onchange(e) {
          return data.password = e.target.value;
        },
        value: data.password
      }), m("ion-button", {
        color: "light",
        onclick: function onclick(e) {
          return onSubmit(mdl, e);
        }
      }, "Sign Up"), m("ion-link", m(m.route.Link, {
        href: "/login"
      }, m("ion-label", "Have an account?")))]);
    }
  };
};

var _default = Register;
exports["default"] = _default;
});

;require.register("pages/user.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Http = _interopRequireDefault(require("Http"));

var _Utils = require("Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var submitTask = function submitTask(http) {
  return function (mdl) {
    return function (data) {
      return http.putTask(mdl)("user")(data);
    };
  };
};

var submit = function submit(mdl, data) {
  var onSuccess = function onSuccess(_ref) {
    var user = _ref.user;
    localStorage.setItem("user", JSON.stringify(user));
    mdl.user = user;
    console.log(mdl.user);
    m.route.set("/home");
  };

  var onError = (0, _Utils.log)("error");
  submitTask(_Http["default"])(mdl)(data).fork(onError, onSuccess);
};

var User = function User(_ref2) {
  var _ref2$attrs$mdl$user = _ref2.attrs.mdl.user,
      image = _ref2$attrs$mdl$user.image,
      username = _ref2$attrs$mdl$user.username,
      password = _ref2$attrs$mdl$user.password,
      bio = _ref2$attrs$mdl$user.bio,
      email = _ref2$attrs$mdl$user.email;
  var data = {
    image: image,
    username: username,
    password: password,
    bio: bio,
    email: email
  };
  return {
    view: function view(_ref3) {
      var mdl = _ref3.attrs.mdl;
      return m("form", m("ion-text", m("h1", "Your Settings")), m("ion-item", m("ion-label", {
        position: "stacked"
      }, "URL of profile picture"), m("ion-input", {
        type: "text",
        placeholder: "URL of profile picture",
        onchange: function onchange(e) {
          return data.image = e.target.value;
        },
        value: data.image
      })), m("ion-item", m("ion-label", {
        position: "stacked"
      }, "Your Name"), m("ion-input", {
        type: "text",
        placeholder: "Your Name",
        onchange: function onchange(e) {
          return data.username = e.target.value;
        },
        value: data.username
      })), m("ion-item", m("ion-label", {
        position: "stacked"
      }, "Short bio about you"), m("ion-textarea", {
        placeholder: "Short bio about you",
        onchange: function onchange(e) {
          return data.bio = e.target.value;
        },
        value: data.bio
      })), m("ion-item", m("ion-label", {
        position: "stacked"
      }, "Email"), m("ion-input", {
        type: "text",
        placeholder: "Email",
        onchange: function onchange(e) {
          return data.email = e.target.value;
        },
        value: data.email
      })), m("ion-item", m("ion-label", {
        position: "stacked"
      }, "Password"), m("ion-input", {
        type: "password",
        placeholder: "Password",
        onchange: function onchange(e) {
          return data.password = e.target.value;
        },
        value: data.password
      })), m("ion-button", {
        color: "light",
        onclick: function onclick(e) {
          return submit(mdl, data);
        }
      }, " Update Settings "));
    }
  };
};

var _default = User;
exports["default"] = _default;
});

;require.register("routes.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("./layout/index"));

var _home = _interopRequireDefault(require("./pages/home"));

var _article = _interopRequireDefault(require("./pages/article"));

var _profile = _interopRequireDefault(require("./pages/profile"));

var _register = _interopRequireDefault(require("./pages/register"));

var _login = _interopRequireDefault(require("./pages/login"));

var _user = _interopRequireDefault(require("./pages/user"));

var _editor = _interopRequireDefault(require("./pages/editor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Routes = [{
  url: "/home",
  config: {
    isAuth: false
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_home["default"], {
      mdl: mdl
    }));
  }
}, {
  url: "/editor",
  config: {
    isAuth: true
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_editor["default"], {
      mdl: mdl,
      key: mdl.slug
    }));
  }
}, {
  url: "/editor/:slug",
  config: {
    isAuth: true
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_editor["default"], {
      mdl: mdl
    }));
  }
}, {
  url: "/article/:slug",
  config: {
    isAuth: true
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_article["default"], {
      mdl: mdl
    }));
  }
}, {
  url: "/profile/:slug",
  config: {
    isAuth: true
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_profile["default"], {
      mdl: mdl,
      key: mdl.slug
    }));
  }
}, {
  url: "/settings/:slug",
  config: {
    isAuth: true
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_user["default"], {
      mdl: mdl,
      key: mdl.slug
    }));
  }
}, {
  url: "/login",
  config: {
    isAuth: false
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_login["default"], {
      mdl: mdl
    }));
  }
}, {
  url: "/register",
  config: {
    isAuth: false
  },
  component: function component(mdl) {
    return m(_index["default"], {
      mdl: mdl
    }, m(_register["default"], {
      mdl: mdl
    }));
  }
}];
var _default = Routes;
exports["default"] = _default;
});

;require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.m = require("mithril");
window.Task = require("data.task");


});})();require('___globals___');


//# sourceMappingURL=app.js.map