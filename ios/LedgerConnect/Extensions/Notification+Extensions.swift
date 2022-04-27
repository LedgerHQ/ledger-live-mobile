//
//  Notification+Extensions.swift
//  LedgerConnect
//
//  Created by Harrison Friia on 4/5/22.
//

import Foundation

extension Notification.Name {

    public static var eventEmitterStartObserving: Notification.Name {
        Notification.Name(rawValue: "EventEmitterStartObserving")
    }

    public static var eventEmitterStopObserving: Notification.Name {
        Notification.Name(rawValue: "EventEmitterStopObserving")
    }

    public static var eventEmitterFinishedRequest: Notification.Name {
        Notification.Name(rawValue: "EventEmitterFinishedRequest")
    }

    public static var eventEmitterError: Notification.Name {
        Notification.Name(rawValue: "EventEmitterError")
    }

}
