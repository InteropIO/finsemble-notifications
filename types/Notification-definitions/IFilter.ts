/**
 * @property {object} name : value - name object pair of filter to match subscriptions on. Most commonly something like {channelName: 'mychannel', source: 'mysource'}
 *
 * TODO: Ensure this interface (or implemented type) is publicly accessible
 */
export default interface IFilter {
  include: []{ fieldnames: string[] };
  exclude: { fieldnames: string[] };
}