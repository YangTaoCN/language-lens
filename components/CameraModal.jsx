export default function CameraModal({isOpen, onClose, onCapture, videoRef, canvasRef}){
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: isOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      pointerEvents: isOpen ? 'auto' : 'none'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '700px',
        width: '90%',
        boxShadow: '0 20px 25px rgba(0,0,0,0.1)'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
          <h2 style={{fontSize: '20px', fontWeight: '600', margin: 0}}>摄像头预览</h2>
          <button
            onClick={onClose}
            style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999', padding: 0, lineHeight: 1}}
          >
            ✕
          </button>
        </div>
        
        <div style={{backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px'}}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{width: '100%', height: 'auto', minHeight: '320px', display: 'block'}}
          />
          <canvas ref={canvasRef} style={{display: 'none'}} />
        </div>

        <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '8px'}}>
          <button
            onClick={onCapture}
            style={{padding: '10px 24px', backgroundColor: '#22c55e', color: 'white', fontWeight: '600', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '16px'}}
            onMouseEnter={e => e.target.style.backgroundColor = '#16a34a'}
            onMouseLeave={e => e.target.style.backgroundColor = '#22c55e'}
          >
            📸 拍照
          </button>
          <button
            onClick={onClose}
            style={{padding: '10px 24px', backgroundColor: '#9ca3af', color: 'white', fontWeight: '600', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '16px'}}
            onMouseEnter={e => e.target.style.backgroundColor = '#6b7280'}
            onMouseLeave={e => e.target.style.backgroundColor = '#9ca3af'}
          >
            关闭
          </button>
        </div>
        
        <p style={{textAlign: 'center', color: '#999', fontSize: '14px', margin: '8px 0 0 0'}}>
          点击"拍照"获取图片，或"关闭"取消
        </p>
      </div>
    </div>
  )
}
