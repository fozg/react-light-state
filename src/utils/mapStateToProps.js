export default function mapStateToProps(data, storeName = 'lightProps') {
  return { [storeName]: data }
}
