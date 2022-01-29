const webpack = require("webpack");

module.exports = () => ({
	devtool: 'cheap-module-source-map',
	plugins: [
	  new webpack.DefinePlugin({
	    "process.env.REACT_APP_AMPLITUDE_KEY": JSON.stringify(process.env.REACT_APP_AMPLITUDE_KEY),
	  })
	]
})