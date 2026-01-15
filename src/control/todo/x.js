import event from '../../unit/event'

const down = store => {
    event.down({
        key: 'x',
        once: true,
        callback: () => {
            // Test cheat: increment clearLines
            store.commit('clearLines', store.state.clearLines + 1)
        }
    })
}

const up = store => {
    event.up({
        key: 'x'
    })
}

export default {
    down,
    up
}
