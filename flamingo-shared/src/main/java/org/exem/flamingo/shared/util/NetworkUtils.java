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

import org.exem.flamingo.shared.core.exception.ServiceException;

import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

public class NetworkUtils {

    public static String getMacAddress() {
        try {
            NetworkInterface networkInterface = getFilteredNetworkInterfaces();
            return toMACString(networkInterface.getHardwareAddress());
        } catch (SocketException ex) {
            throw new ServiceException("Unable to get the mac address of 1st Network Interface.", ex);
        }
    }

    public static String getDisplayName() {
        NetworkInterface networkInterface = getFilteredNetworkInterfaces();
        return networkInterface.getDisplayName();
    }

    public static String getName() {
        NetworkInterface networkInterface = getFilteredNetworkInterfaces();
        return networkInterface.getName();
    }

    public static NetworkInterface getFilteredNetworkInterfaces() {
        List<NetworkInterface> networkInterfaces = getNetworkInterfaces();
        NetworkInterface selected = null;
        String selectedNic = System.getProperty("flamingo.license.nic.name");
        if (!StringUtils.isEmpty(selectedNic)) {
            for (NetworkInterface nic : networkInterfaces) {
                if (selectedNic.equals(nic.getName())) {
                    selected = nic;
                    return selected;
                }
            }
        }
        return networkInterfaces.get(0);
    }

    public static List<NetworkInterface> getNetworkInterfaces() {
        try {
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            List<NetworkInterface> list = new ArrayList<>();
            while (interfaces.hasMoreElements()) {
                NetworkInterface nic = interfaces.nextElement();
                if (nic.getHardwareAddress() != null) {
                    list.add(nic);
                }
            }

            if (list.size() < 1) {
                throw new ServiceException("There is no MAC Address of the Network Interface.");
            } else {
                return list;
            }
        } catch (Exception ex) {
            throw new ServiceException("Unable to get the mac address of Network Interface.", ex);
        }
    }

    private static String toMACString(byte[] mac) {
        String macAddress = "";
        for (int i = 0; i < mac.length; i++) {
            macAddress += String.format("%02X%s", mac[i], (i < mac.length - 1) ? ":" : "");
        }
        macAddress.replaceAll("-", ":");
        return macAddress;
    }


    static class InterfaceInfo {
        public boolean isLoopback;
        public byte[] macAddress;
        public String name;
        public String displayName;

        @Override
        public String toString() {
            final StringBuffer sb = new StringBuffer("InterfaceInfo{");
            sb.append("isLoopback=").append(isLoopback);
            sb.append(", macAddress=");
            if (macAddress == null) sb.append("null");
            else {
                sb.append('[');
                for (int i = 0; i < macAddress.length; ++i)
                    sb.append(i == 0 ? "" : ", ").append(macAddress[i]);
                sb.append(']');
            }
            sb.append(", name='").append(name).append('\'');
            sb.append(", displayName='").append(displayName).append('\'');
            sb.append('}');
            return sb.toString();
        }
    }

    private static InterfaceInfo getInterfaceInfo(NetworkInterface nic) {
        try {
            InterfaceInfo info = new InterfaceInfo();
            info.isLoopback = nic.isLoopback();
            info.macAddress = nic.getHardwareAddress();
            info.name = nic.getName();
            info.displayName = nic.getDisplayName();
            return info;
        } catch (Exception ex) {
            throw new ServiceException("Unable to get the information of Network Interface.", ex);
        }
    }
}
