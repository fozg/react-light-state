# 0.0.6 working
- Added `useStore` hook
- Added `dispatch` api
- Update `setState`
- Fixed init data issues

# 0.0.5
- Added render props `<Light mapStateToProps={...}>`.
- Added `connect` hoc, same with `withLight`.

# 0.0.4
- Fix `withLight` hocs.
- `setState` now support `async` function.

# 0.0.3
- Now support `mapStateToProps`.
- Now support setState async by default, like redux-thunk.
- Added `resetState`.
- Added `boomerang` method.
- Added `subscribe` method.
- Added `unsubscribe` method.

Fixes:
- Added unsubscribe & remove all subscribe when umount a `withLight`.
