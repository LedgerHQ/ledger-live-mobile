//
//  NSObject+Extensions.swift
//  LedgerConnect
//
//  Created by Harrison Friia on 4/6/22.
//

import Foundation

extension NSObject {

    var address: String {
        String(describing: Unmanaged.passUnretained(self).toOpaque())
    }

}
