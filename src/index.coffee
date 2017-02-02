
iectrl = require('iectrl')


__toClassName = (name) ->
	[name, name.replace(/[^A-Za-z0-9]/g, '').toUpperCase()]

class IEVMBaseLauncher

	constructor: (baseBrowserDecorator, config, args, logger) ->
		baseBrowserDecorator(@)

		config.IEVMSettings ?= {}
		config.IEVMSettings.debug ?= false
		config.IEVMSettings.stopOnExit ?= false
		config.IEVMSettings.host ?= iectrl.IEVM.hostIp

		{ @IEVMSettings } = config

		log = logger.create("#{@machine.name}.launcher")
		@machine.debug = log.debug.bind(log) if @IEVMSettings.debug

		@_start = (url) =>

			if @IEVMSettings.host?
				url = "#{url}".replace 'localhost', @IEVMSettings.host

			@machine
				.running()
				.then (booted) =>
					@machine.alreadyBooted = booted
					return @machine.open(url) if booted

					@machine
						.start(headless = true)
						.then =>
							@machine.open(url)


		@forceKill = ->

			new Promise (resolve, reject) =>
				unless @IEVMSettings.stopOnExit
					return @machine
						.close()
						.then resolve

				@machine
					.close()
					.then => @machine.stop().then(resolve).catch(reject)
					.then resolve
					.catch reject


	DEFAULT_CMD: { linux: iectrl.IEVM.ievmsHome }

	$inject: [
		'baseBrowserDecorator',
		'config.IEVMSettings',
		'args',
		'logger'
	]



iectrl.IEVM.names
	.map __toClassName
	.reduce ((Launchers, [original, name], obj) ->
		Launchers["launcher:#{original}"] =  [
			'type',
			class extends IEVMBaseLauncher
				constructor: (baseBrowserDecorator, config, args, logger) ->
					@name = "#{name}Launcher"
					@ENV_CMD = "#{name}_BIN"
					@machine = iectrl.IEVM.find(original).pop()
					super
		]
		Launchers
	), module.exports


