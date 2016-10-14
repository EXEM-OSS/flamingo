/**
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 * <p/>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * <p/>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p/>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.exem.flamingo.shared.util;

import java.io.IOException;
import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

/**
 * Thank DANIEL PIETRARU
 */
public class NetworkInterfaceInfo {

    private static final String NL = System.getProperty("line.separator");
    private static final String NL_TAB = NL + "  ";
    private static final String IPV4 = "IPv4";
    private static final String IPV6 = "IPv6";

    private static class InterfaceInfo {
        public String displayName;
        public String name;
        public int mtu;
        public boolean isUp;
        public boolean isLoopback;
        public boolean isPointToPoint; // e.g. a PPP modem interface
        public boolean isVirtual;      // a sub-interface
        public boolean supportsMulticast;
        public byte[] macAddress;
        public List<IpAddressInfo> ipAddresses;
        public List<InterfaceInfo> subInterfaces;

        public String toString() {
            StringBuilder sb = new StringBuilder(NL);
            sb.append("*** Interface [" + name + "] ***").append(NL);

            sb.append(NL).append("display name  : " + displayName);
            sb.append(NL).append("MTU           : " + mtu);
            sb.append(NL).append("loopback      : " + isLoopback);
            sb.append(NL).append("point to point: " + isPointToPoint);
            sb.append(NL).append("up            : " + isUp);
            sb.append(NL).append("virtual       : " + isVirtual);
            sb.append(NL).append("multicast     : " + supportsMulticast);

            sb.append(NL).append("HW address    : ");
            if (macAddress != null) {
                for (byte b : macAddress) {
                    sb.append(String.format("%1$02X ", b));
                }
            } else {
                sb.append("n/a");
            }

            for (IpAddressInfo ipAddr : ipAddresses) {
                sb.append(ipAddr);
            }

            for (InterfaceInfo subInfo : subInterfaces) {
                sb.append(subInfo);
            }

            return sb.toString();
        }
    }

    private static class IpAddressInfo {
        public String ipAddress;
        public String ipVersion = "unknown";
        public String hostName;
        public String canonicalHostName;
        public boolean isLoopback;
        public boolean isSiteLocal; // private IP address
        public boolean isAnyLocal;  // wildcard address
        public boolean isLinkLocal;
        public boolean isMulticast;
        public boolean isReachable;

        public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append(NL).append("INET address (" + ipVersion + "): " + ipAddress);
            sb.append(NL_TAB).append("host name           : " + hostName);
            sb.append(NL_TAB).append("canonical host name : " + canonicalHostName);
            sb.append(NL_TAB).append("loopback            : " + isLoopback);
            sb.append(NL_TAB).append("site local          : " + isSiteLocal);
            sb.append(NL_TAB).append("any local           : " + isAnyLocal);
            sb.append(NL_TAB).append("link local          : " + isLinkLocal);
            sb.append(NL_TAB).append("multicast           : " + isMulticast);
            sb.append(NL_TAB).append("reachable           : " + isReachable);

            return sb.toString();
        }
    }

    private static InterfaceInfo getInterfaceInfo(NetworkInterface nif) throws IOException {
        // get interface information
        InterfaceInfo info = new InterfaceInfo();
        info.displayName = nif.getDisplayName();
        info.name = nif.getName();
        info.mtu = nif.getMTU();
        info.isUp = nif.isUp();
        info.isLoopback = nif.isLoopback();
        info.isPointToPoint = nif.isPointToPoint();
        info.isVirtual = nif.isVirtual();
        info.supportsMulticast = nif.supportsMulticast();
        info.macAddress = nif.getHardwareAddress();
        info.ipAddresses = new ArrayList<IpAddressInfo>();
        info.subInterfaces = new ArrayList<InterfaceInfo>();

        // Get IP address information
        Enumeration<InetAddress> inetAddresses = nif.getInetAddresses();
        while (inetAddresses.hasMoreElements()) {
            InetAddress inetAddr = inetAddresses.nextElement();

            IpAddressInfo ipInfo = new IpAddressInfo();
            if (inetAddr instanceof Inet4Address) {
                ipInfo.ipVersion = IPV4;
            } else if (inetAddr instanceof Inet6Address) {
                ipInfo.ipVersion = IPV6;
            }
            ipInfo.ipAddress = inetAddr.getHostAddress();
            ipInfo.hostName = inetAddr.getHostName();
            ipInfo.canonicalHostName = inetAddr.getCanonicalHostName();
            ipInfo.isAnyLocal = inetAddr.isAnyLocalAddress();
            ipInfo.isLinkLocal = inetAddr.isLinkLocalAddress();
            ipInfo.isSiteLocal = inetAddr.isSiteLocalAddress();
            ipInfo.isLoopback = inetAddr.isLoopbackAddress();
            ipInfo.isMulticast = inetAddr.isMulticastAddress();
            ipInfo.isReachable = inetAddr.isReachable(5000);

            info.ipAddresses.add(ipInfo);
        }

        // Get virtual interface information
        Enumeration<NetworkInterface> subIfs = nif.getSubInterfaces();
        while (subIfs.hasMoreElements()) {
            NetworkInterface subIf = subIfs.nextElement();
            InterfaceInfo subInfo = getInterfaceInfo(subIf);
            info.subInterfaces.add(subInfo);
        }

        return info;
    }

    public static void main(String[] args) throws IOException {
        Enumeration<NetworkInterface> interfaces =
                NetworkInterface.getNetworkInterfaces();

        while (interfaces.hasMoreElements()) {
            NetworkInterface nic = interfaces.nextElement();
            if (nic.getHardwareAddress() != null) {
                System.out.println(getInterfaceInfo(nic));
            }
        }
    }
}