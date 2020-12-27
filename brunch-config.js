// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      "vendor.js": /^(?!app)/, // Files that are not in `app` dir.
      "app.js": /^app/,
    },
  },
  stylesheets: {
    // order: {
    //   // before: ["./imports.scss"],
    //   after: ["app.css"],
    // },
    joinTo: {
      "app.css": [
        (path) => path.includes(".scss"),
        (path) => path.includes(".css"),
        (path) => path.includes(".sass"),
      ],
    },
  },
}

exports.modules = {
  autoRequire: {
    "app.js": ["initialize"],
  },
}

exports.plugins = {
  terser: {
    ignored: [/^(vendor)/, /^node_modules\/(?!@ionic)/],
    mangle: false,
    compress: {
      global_defs: {
        DEBUG: false,
      },
    },
  },
  sass: {
    precision: 8,
    mode: "native",
    sourceMapEmbed: true,
    includePaths: [],
  },
  imagemin: {
    plugins: {
      "imagemin-gifsicle": true,
      "imagemin-jpegtran": true,
      "imagemin-optipng": true,
      "imagemin-svgo": true,
    },
    pattern: /\.(gif|jpg|jpeg|jpe|jif|jfif|jfi|png|svg|svgz)$/,
  },
  babel: {
    ignore: [/^(vendor)/, /^node_modules\/(?!@ionic)/],
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          regenerator: true,
        },
      ],
    ],
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            esmodules: true,
          },
        },
      ],
    ],
  },
  copycat: {
    fonts: [
      // "app/assets/fonts",
    ],
    images: ["app/assets/images"],
    verbose: true, //shows each file that is copied to the destination directory
    onlyChanged: true, //only copy a file if it's modified time has changed (only effective when using brunch watch)
  },
  swPrecache: {
    swFileName: "service-worker.js",
    options: {
      autorequire: ["app/assets/index.html", "app/assets/images"],
      staticFileGlobs: [
        "docs/app.css",
        "docs/app.js",
        "docs/vendor.js",
        "docs/index.html",
      ],
      stripPrefix: "docs/",
    },
  },
  "@babel": { presets: ["env"] },
  autoReload: {
    enabled: {
      css: true,
      js: true,
      assets: false,
    },
    // port: [3333],
    // keyPath: "app",
    // certPath: "app",
    forcewss: process.env.NODE_ENV == "development" && false,
  },
}

exports.paths = {
  public: "docs",
  watched: ["app", "app/components", "app/pages", "app/assets", "app/Models"],
}

exports.npm = {
  compilers: ["babel-brunch"],
  enabled: true,
  globals: { m: "mithril", Task: "data.task" },
}
