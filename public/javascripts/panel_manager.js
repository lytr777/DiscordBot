{
    var socket = io.connect('', {
        reconnect: false
    });
    socket
        .on('initialState', function (data) {
            initialization(data);
        })
        .on('channelUpdate', function (channelData) {
            addChannelsAndMembers(channelData);
        })
        .on('queueAdd', function (track) {
            var time = Math.floor(track.time / 60) + ':' + ((track.time % 60) > 9 ? '' : '0') + (track.time % 60);
            addTrackInQueue(track.name, time, track.source);
        })
        .on('queueNext', function () {
            nextTrack();
        })
        .on('currentProgressUpdate', function (progress) {
            setCurrentProgress(progress);
        })
        .on('error', function (reason) {
            if (reason != "handshake unauthorized") {
                setTimeout(function () {
                    socket.socket.connect();
                }, 500);
            }
        });

    function initialization(data) {
        addChannelsAndMembers(data.channels);
        addTracks(data.queue);
        if (data.current) {
            if (data.current.track) {
                var time = Math.floor(data.current.track.time / 60) + ':' + ((data.current.track.time % 60) > 9 ? '' : '0')
                    + (data.current.track.time % 60);
                setCurrent(data.current.track.name, time, data.current.progress, data.current.paused);
            } else
                setCurrent('', '', data.current.progress, data.current.paused);
        } else
            setCurrent('', '', 0, false);
        initializeLibrary(data.library);
    }

    function addChannelsAndMembers(channels) {
        var parent = document.getElementById('voice-channels');
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        for (var i = 0; i < channels.length; i++) {
            var channel_name = document.createElement('div'),
                channel_selected = document.createElement('div');
            channel_name.className = 'voice-channel-name';
            channel_name.innerHTML = channels[i].name;
            channel_selected.className = 'voice-channel-selected';
            var channel_info = document.createElement('div'),
                channel = document.createElement('div');
            channel_info.className = 'voice-channel-info';
            channel.className = 'voice-channel';
            channel_info.appendChild(channel_selected);
            channel_info.appendChild(channel_name);
            channel.appendChild(channel_info);
            var members = document.createElement('div');
            members.className = 'members';
            for (var j = 0; j < channels[i].members.length; j++) {
                var member = document.createElement('div');
                member.className = 'member-name';
                member.innerHTML = channels[i].members[j].username;
                members.appendChild(member);
            }
            channel.appendChild(members);
            parent.appendChild(channel);
        }
    }

    function addTracks(tracks) {
        var queue = document.getElementById('current-queue');
        while (queue.firstChild) {
            queue.removeChild(queue.firstChild);
        }
        if (tracks) {
            console.log(tracks.length);
            for (var i = 0; i < tracks.length; i++) {
                var time = Math.floor(tracks[i].time / 60) + ':' + ((tracks[i].time % 60) > 9 ? '' : '0') +
                    (tracks[i].time % 60);
                addTrackInQueue(tracks[i].name, time, tracks[i].source);
            }
        }
    }

    function setCurrent(name, time, progress, paused) {
        console.log(name + ' ' + time + ' ' + progress + ' ' + paused);
        var current = document.getElementById('current-track-info'),
            state = document.getElementById('play-pause-button');
        current.firstElementChild.innerHTML = name;
        current.lastElementChild.innerHTML = time;
        state.className = ((paused) ? 'pause' : 'play') + '-button';
        setCurrentProgress(progress);
    }

    function setCurrentProgress(progress) {
        var played = document.getElementById('played'),
            left = document.getElementById('left');
        played.style.width = progress + '%';
        left.style.width = (100 - progress) + '%';
    }

    function addTrackInQueue(name, time, source) {
        if (name && time && source) {
            var queue = document.getElementById('current-queue');
            var newTrack = document.createElement('div');
            newTrack.className = 'queue-track-info';
            var sourceDiv = document.createElement('div'),
                nameDiv = document.createElement('div'),
                timeDiv = document.createElement('div');
            sourceDiv.className = 'queue-track-source queue-track-source-' + source;
            nameDiv.className = 'queue-track-name';
            nameDiv.innerHTML = name;
            timeDiv.className = 'queue-track-time';
            timeDiv.innerHTML = time;
            newTrack.appendChild(sourceDiv);
            newTrack.appendChild(nameDiv);
            newTrack.appendChild(timeDiv);
            queue.appendChild(newTrack);
        }
    }

    function nextTrack() {
        var queue = document.getElementById('current-queue');
        if (queue.childElementCount > 0) {
            var next = queue.firstElementChild;
            next.removeChild(next.firstElementChild);
            var name = next.firstElementChild.innerHTML,
                time = next.lastElementChild.innerHTML;
            queue.removeChild(next);
            setCurrent(name, time, 0, false)
        }
    }

    function initializeLibrary(library) {
        var used = document.getElementById('used'),
            free = document.getElementById('free');
        var pr = 0;
        if (library.space.all != 0)
            pr = Math.floor(100 * library.space.free / library.space.all);
        used.style.width = (100 - pr) + '%';
        free.style.width = pr + '%';
        var space_info = document.getElementById('disc-space-info-size');
        space_info.innerHTML = library.space.free + ' MB (' + pr + '%)';
        if (library.space.all != 0) {
            var library_wrapper = document.getElementById('library-wrapper');
            library_wrapper.hidden = false;
        }
    }
}