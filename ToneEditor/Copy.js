define(['./libs/clipboard.min','Utils','ToneEditor', 'Templates/Component'], function (Clipboard, utils, ToneEditor, Component) {

  Component.prototype.toString = function(minify, useRefObjects) {
    var minify = minify || ToneEditor._options.minify
    var useSettingsObjects = useSettingsObjects || ToneEditor._options.useSettingsObjects

    // MINIFY (default: false)
    // Minify/collapse copied text
    if (minify) {
      var result = JSON.stringify(this.toneComponent.get())
    } else {
      var result = JSON.stringify(this.toneComponent.get(), null, '\t')
    }

    // USE REF OBJECTS (default: false)
    // Make copying and pasting more convenient by returning the settings as an object that you can reference elsewhere in your code.
    if (useSettingsObjects) {
      result = 'var '+this.name+'Settings=\n'+result
    }

    return result
  }

  // RETURNS FLATTENED PROPERTIES OF TONECOMPONENT
  new Clipboard( '.tone-editor_container .copy-button', {
    text: function(trigger) {
      var text = ''

      if (trigger.classList.contains('copy-all')) { // it's the copy-all button
        ToneEditor.components.forEach( function(component) {
          text+=component.toString(true, true)+';\n'
        })

      } else { // It's a component copy button
        var id = trigger.getAttribute('data-component-id')
        var component = ToneEditor.componentsById[id]

        text+=component.toString()
      }

      if (ToneEditor._options.copyLog) console.log(text)
      return text
    }
  })

})
