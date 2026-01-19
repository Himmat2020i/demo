#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LivePatchModule, NSObject)

RCT_EXTERN_METHOD(saveData:(NSString *)key url:(NSString *)url)

@end
