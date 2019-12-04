/**
 * @property {object} name : value - name object pair of filter to match subscriptions on. Most commonly something like {channelName: 'mychannel', source: 'mysource'}
 */
export default interface IFilter {
    [key: string]: object;
}
