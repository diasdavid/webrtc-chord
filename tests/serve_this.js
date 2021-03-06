var chord = require('./../src/index.js');
var pp = require('piri-piri.client');

window.app = {
  init: function() {

    var ppOptions = {url: 'http://localhost:9876'};

    pp.start(ppOptions, function() {

      var nodeConfig = {
        signalingURL: 'http://localhost:9000',
        tracing: true,
        logging: true
      };

      var node;

      pp.register('create-node', function(data) {
        console.log('ACTION: create-node');
        node = chord.createNode(nodeConfig);

        node.e.on('ready', function() {
          console.log('node - ' + node.id() + ' - is ready');
          pp.tell({
            nodeId: node.id(),
            message: 'node is ready'
           });
        });

        node.e.on('message', function(message) {
          console.log('message-receive', message);
          pp.tell({
            nodeId: node.id(),
            message: message
          });
        });

      });

      pp.register('finger-table', function() {
        console.log('ACTION: finger-table - ', node.fingerTable());
        pp.tell(node.fingerTable());
      });

      pp.register('send', function(data) {
        console.log('ACTION: send to - ', data.toId, data.message);
        node.send(data.toId, data.message);
      });

      pp.register('send-sucessor', function(data) {
        console.log('ACTION: send-sucessor');

        node.sendSucessor(data.message);
      });
    });
  }
};

window.app.init();
