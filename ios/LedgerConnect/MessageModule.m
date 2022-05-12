//
//  MessageModule.m
//  LedgerConnect Extension (iOS)
//
//  Created by Harrison Friia on 1/28/22.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"


@interface RCT_EXTERN_MODULE(EventEmitter, RCTEventEmitter)
RCT_EXTERN_METHOD(supportedEvents)

RCT_EXTERN_METHOD(startObserving)
RCT_EXTERN_METHOD(stopObserving)

RCT_EXTERN_METHOD(foundDevices:(NSString)devices)
RCT_EXTERN_METHOD(signatureComplete:(NSString)signature)

RCT_EXTERN_METHOD(requestComplete:(NSString)result)

RCT_EXTERN_METHOD(transportError:(NSString)error)

@end
