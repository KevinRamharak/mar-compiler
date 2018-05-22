import moduleAlias from "module-alias";

// this is really ugly but it works
moduleAlias.addAliases({
    "@": __dirname + "/", // current dir
    "@test": __dirname + "/../test/", // current dir + above + test
});

moduleAlias();
