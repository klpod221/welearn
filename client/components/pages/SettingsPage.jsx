"use client";

import { useState, useEffect } from "react";
import useNotify from "@/hooks/useNotify";

import { getAll, create, update, remove } from "@/services/settingsService";

import DataPage from "@/components/layouts/DataPage";
import SettingForm from "@/components/forms/SettingForm";

import {
  Card,
  Button,
  Popconfirm,
  Tooltip,
  Modal,
  Skeleton,
  Empty,
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

export default function SettingsPage() {
  const notify = useNotify();

  const [settings, setSettings] = useState([]);

  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    type: "string",
    autoload: false,
  });
  const [selectedSetting, setSelectedSetting] = useState({});

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await getAll();
      setSettings(data);
    } catch (error) {
      notify.error(error.message || "Failed to fetch settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      notify.loading("Creating setting...");

      const params = {
        key: values.key,
        value: String(values.value),
        type: values.type,
        autoload: values.autoload,
      };

      if (values.type === "boolean") {
        params.value = String(values.value ? true : false);
      }

      const { data } = await create(params);

      setSettings([...settings, data]);
      notify.success("Setting created successfully");
      setCreateModalOpen(false);
    } catch (error) {
      notify.error(error.message || "Failed to create setting");
      console.error(error);
    }
  };

  const handleUpdate = async (values) => {
    try {
      notify.loading("Updating setting...");

      const params = {
        key: values.key,
        value: String(values.value),
        type: values.type,
        autoload: values.autoload,
      };

      if (values.type === "boolean") {
        params.value = String(values.value ? true : false);
      }

      const { data } = await update(selectedSetting.id, params);

      const updatedSettings = settings.map((setting) =>
        setting.id === selectedSetting.id ? data : setting
      );
      setSettings(updatedSettings);
      notify.success("Setting updated successfully");
      setEditModalOpen(false);
    } catch (error) {
      notify.error(error.message || "Failed to update setting");
      console.error(error);
    }
  };

  const handleDelete = async (settingId) => {
    try {
      notify.loading("Deleting setting...");
      await remove(settingId);

      const updatedSettings = settings.filter(
        (setting) => setting.id !== settingId
      );
      setSettings(updatedSettings);
      notify.success("Setting deleted successfully");
    } catch (error) {
      notify.error(error.message || "Failed to delete setting");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <DataPage
      title={"Settings"}
      actions={
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => setCreateModalOpen(true)}
        >
          New setting
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {/* create 3 skeleton with Card */}
        {loading && (
          <>
            <Card>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
            <Card>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
            <Card>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          </>
        )}

        {!loading && settings.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Empty description="No settings found" />
          </div>
        )}

        {!loading &&
          settings.length > 0 &&
          settings.map((setting) => (
            <Card
              key={setting.id}
              title={setting.key}
              size="small"
              extra={
                <>
                  <Tooltip title="Edit">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setSelectedSetting(setting);
                        setEditModalOpen(true);
                      }}
                      className="!text-blue-500 !hover:text-blue-700"
                    />
                  </Tooltip>
                  <Popconfirm
                    title="Are you sure to delete this setting?"
                    onConfirm={() => handleDelete(setting.id)}
                  >
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      className="!text-red-500 !hover:text-red-700"
                    />
                  </Popconfirm>
                </>
              }
            >
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Value:</span> {setting.value}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Type:</span> {setting.type}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Autoload:</span>{" "}
                  {setting.autoload ? "Yes" : "No"}
                </p>
              </div>
            </Card>
          ))}
      </div>

      <Modal
        title="Create new setting"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          setNewSetting({
            key: "",
            value: "",
            type: "string",
            autoload: false,
          });
        }}
        footer={
          <Button type="primary" onClick={() => handleCreate(newSetting)}>
            Create
          </Button>
        }
        width={400}
      >
        <SettingForm setting={newSetting} onChange={setNewSetting} />
      </Modal>

      <Modal
        title="Edit setting"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedSetting({});
        }}
        footer={
          <Button type="primary" onClick={() => handleUpdate(selectedSetting)}>
            Update
          </Button>
        }
        width={400}
      >
        <SettingForm setting={selectedSetting} onChange={setSelectedSetting} />
      </Modal>
    </DataPage>
  );
}
