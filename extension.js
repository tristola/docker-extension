const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const GLib = imports.gi.GLib;
const Soup = imports.gi.Soup;
const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());
let text, button;

// we get the list of containers from socket
function getContainers(callback) {
  //TODO: move url to a setting
  var request = Soup.Message.new('GET', 'http://127.0.0.1:5555/containers/json');
  _httpSession.queue_message(request, function(_httpSession, message) {
    if (message.status_code !== 200) {
      callback(message.status_code, null);
      return;
    }
    var containersData = request.response_body.data;
    var containers = JSON.parse(containersData);
    callback(null, containers);
  });
}

//hide when clicked or timeout
function _hideContainers() {
  Main.uiGroup.remove_actor(text);
  text = null;
}

// get Textual representation
function _listContainersAsText(data) {
  containerlist = '';
  for (i in data) {
    containerlist += data[i].Image + ', names:' + data[i].Names + '\n';
  }
  if (containerlist.length === 0) {
    containerlist = 'No containers running';
  }
  return containerlist;
}

function _showContainerList() {
  if (!text) {
    var containerlist = '';
    getContainers(function(code, data) {
      if (!data) {
        containerlist = 'No data available';
      } else {
        containerlist = _listContainersAsText(data);
      }
      text = new St.Label({
        style_class: 'helloworld-label',
        text: containerlist
      });
      Main.uiGroup.add_actor(text);
      text.opacity = 255;

      let monitor = Main.layoutManager.primaryMonitor;
      text.set_position(Math.floor(monitor.width / 2 - text.width / 2),
        24);
      //Move timout delay to settings
      Tweener.addTween(text, {
        opacity: 255,
        time: 10,
        transition: 'easeOutQuad',
        onComplete: _hideContainers
      });
    });
  } else {
    _hideContainers();
  }
}

function init() {
  button = new St.Bin({
    style_class: 'panel-button',
    reactive: true,
    can_focus: true,
    x_fill: true,
    y_fill: false,
    track_hover: true
  });
  let text = new St.Label({
    text: 'Containers'
  });
  button.set_child(text);
  button.connect('button-press-event', _showContainerList);
}

function enable() {
  Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
  Main.panel._rightBox.remove_child(button);
}
